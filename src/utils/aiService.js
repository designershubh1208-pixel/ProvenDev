// src/utils/aiService.js

export const generateProjectSummary = async (project) => {
    if (!project.repo || !project.repo.includes("github.com")) {
        return "⚠️ Fetch Failed: Invalid GitHub URL. Please provide a valid public repository link.";
    }

    try {
        // 1. Extract Owner/Repo
        // Example: https://github.com/username/projectname -> username/projectname
        const parts = project.repo.split("github.com/")[1].split("/");
        const owner = parts[0];
        const repoName = parts[1];

        // 2. Fetch Raw README directly from GitHub
        const readmeResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/readme`, {
            headers: { 'Accept': 'application/vnd.github.v3.raw' }
        });

        if (!readmeResponse.ok) {
            if (readmeResponse.status === 404) throw new Error("README.md not found in this repository.");
            throw new Error("Could not access repository (Private or Invalid).");
        }

        const readmeContent = await readmeResponse.text();

        // 3. Return the raw README content
        return `
      📂 **Repository README.md**
      
      ${readmeContent}
    `;

    } catch (error) {
        console.error(error);
        return `
      ⚠️ **Fetch Error**
      ${error.message}
      
      *Static Data:*
      • Project: ${project.name}
      • Tech: ${project.tech}
    `;
    }
};