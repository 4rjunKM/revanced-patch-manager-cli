
import { GoogleGenAI } from "@google/genai";
import { Patch, TargetApp, GitRepo, GroundingLink } from "../types";

const extractJson = (text: string) => {
  try {
    const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Failed to parse JSON from response:", text);
    return null;
  }
};

const extractSources = (response: any): GroundingLink[] => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks || !Array.isArray(chunks)) return [];
  
  return chunks
    .filter((chunk: any) => chunk.web && chunk.web.uri)
    .map((chunk: any) => ({
      uri: chunk.web.uri,
      title: chunk.web.title || chunk.web.uri
    }));
};

async function callGeminiWithRetry(
  task: (ai: GoogleGenAI) => Promise<any>, 
  retries = 3, 
  delay = 2500
): Promise<any> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    return await task(ai);
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || 
                        error?.message?.includes("429") || 
                        error?.message?.includes("quota") ||
                        error?.message?.includes("RESOURCE_EXHAUSTED");

    if (isRateLimit && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiWithRetry(task, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const fetchGitRepos = async (): Promise<{ repos: GitRepo[], sources: GroundingLink[] }> => {
  try {
    const result = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Find official and high-quality community ReVanced patch repositories on GitHub. Include revanced/revanced-patches, inotia00/revanced-patches, and anddea/revanced-patches. Return JSON: [{id, owner, name, description, url, stars, lastUpdated, branch, isOfficial}].",
        config: { tools: [{ googleSearch: {} }] }
      });
    });

    const data = extractJson(result.text || "");
    const sources = extractSources(result);
    const repos: GitRepo[] = (Array.isArray(data) ? data : []).map((repo: any) => ({
      ...repo,
      id: repo.id || Math.random().toString(36).substr(2, 9)
    }));

    return { repos, sources };
  } catch (error) {
    return { repos: [], sources: [] };
  }
};

export const fetchSupportedApps = async (): Promise<{ apps: TargetApp[], sources: GroundingLink[] }> => {
  try {
    const result = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "List applications supported by ReVanced. For each, find the recommended APK version (the most stable version for patching) and official Google Play icon. Return JSON: [{id, name, icon, iconUrl, packageName, recommendedVersion}].",
        config: { tools: [{ googleSearch: {} }] }
      });
    });

    const data = extractJson(result.text || "");
    const sources = extractSources(result);
    const apps: TargetApp[] = (Array.isArray(data) ? data : []).map((app: any) => ({
      id: String(app.id || Math.random().toString(36).substr(2, 9)),
      name: String(app.name || 'Unknown App'),
      packageName: String(app.packageName || ''),
      icon: String(app.icon || '📦'),
      iconUrl: app.iconUrl && app.iconUrl.startsWith('http') ? app.iconUrl : undefined,
      color: 'bg-violet-500',
      recommendedVersion: String(app.recommendedVersion || 'Any')
    }));

    return { apps, sources };
  } catch (error) {
    return { apps: [], sources: [] };
  }
};

export const fetchLatestPatches = async (): Promise<{ patches: Patch[], sources: GroundingLink[] }> => {
  try {
    const result = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: "Scrape the official ReVanced patches registry (https://revanced.app/patches). Return a comprehensive JSON array of all available patches: [{id, name, description, compatibleApps: []}].",
        config: { tools: [{ googleSearch: {} }] }
      });
    });

    const data = extractJson(result.text || "");
    const sources = extractSources(result);
    const patches: Patch[] = (Array.isArray(data) ? data : []).map((p: any) => ({
      id: String(p.id || ''),
      name: String(p.name || 'Untitled Patch'),
      description: String(p.description || ''),
      enabled: false,
      compatibleApps: Array.isArray(p.compatibleApps) ? p.compatibleApps.map(String) : [],
      compatibilityStatus: 'unknown'
    }));

    return { patches, sources };
  } catch (error) {
    return { patches: [], sources: [] };
  }
};

export const verifyPatchCompatibility = async (app: TargetApp, patches: Patch[]): Promise<{ verifiedPatches: Patch[], sources: GroundingLink[] }> => {
  try {
    const result = await callGeminiWithRetry(async (ai) => {
      return await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `STRICT COMPATIBILITY CHECK for ${app.name} (${app.packageName}). Patches: ${patches.map(p => p.id).join(', ')}. Return JSON status mapping.`,
        config: { tools: [{ googleSearch: {} }] }
      });
    });

    const data = extractJson(result.text || "");
    const sources = extractSources(result);
    
    const verifiedPatches: Patch[] = patches.map(p => {
      const verified = Array.isArray(data) ? data.find((d: any) => d.id === p.id) : null;
      return verified ? { ...p, compatibilityStatus: verified.status, compatibilityNote: verified.note } : p;
    });

    return { verifiedPatches, sources };
  } catch (error) {
    return { verifiedPatches: patches, sources: [] };
  }
};

export const generateCLICommand = async (app: TargetApp, patches: Patch[], filename: string): Promise<string> => {
  const enabledPatches = patches
    .filter(p => p.enabled)
    .filter(p => {
      if (p.compatibilityStatus === 'incompatible') return false;
      if (!p.compatibleApps || p.compatibleApps.length === 0) return true;
      return p.compatibleApps.some(pkg => app.packageName.toLowerCase().includes(pkg.toLowerCase()));
    })
    .map(p => `--include "${p.id}"`).join(' ');
  
  const safeFilename = filename === "none" ? "input.apk" : filename;
  const outputFilename = filename === "none" ? "Output.apk" : `patched_${filename}`;
  
  return `java -jar revanced-cli.jar patch -p patches.rvp -o ${outputFilename} ${safeFilename} ${enabledPatches}`;
}
