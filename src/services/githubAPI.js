// GitHub API service for reading and writing TASKS.md

const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
  constructor() {
    this.token = localStorage.getItem('github_token') || '';
    this.owner = localStorage.getItem('github_owner') || '';
    this.repo = localStorage.getItem('github_repo') || '';
    this.filePath = 'TASKS.md';
  }

  setCredentials(token, owner, repo) {
    this.token = token;
    this.owner = owner;
    this.repo = repo;
    localStorage.setItem('github_token', token);
    localStorage.setItem('github_owner', owner);
    localStorage.setItem('github_repo', repo);
  }

  getCredentials() {
    return {
      token: this.token,
      owner: this.owner,
      repo: this.repo,
      isConfigured: !!(this.token && this.owner && this.repo)
    };
  }

  clearCredentials() {
    this.token = '';
    this.owner = '';
    this.repo = '';
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_owner');
    localStorage.removeItem('github_repo');
  }

  async fetchFile() {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error('GitHub credentials not configured');
    }

    const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // File doesn't exist, return empty content
        return { content: '', sha: null };
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = atob(data.content); // Decode base64
    
    return {
      content,
      sha: data.sha
    };
  }

  async updateFile(content, message = 'Update tasks') {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error('GitHub credentials not configured');
    }

    const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/contents/${this.filePath}`;
    
    // Get current file SHA
    let sha = null;
    try {
      const currentFile = await this.fetchFile();
      sha = currentFile.sha;
    } catch (error) {
      // File might not exist yet, that's okay
    }

    const body = {
      message,
      content: btoa(unescape(encodeURIComponent(content))), // Encode to base64
      ...(sha && { sha }) // Include SHA if file exists
    };

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async fetchCommitHistory(limit = 10) {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error('GitHub credentials not configured');
    }

    const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}/commits?path=${this.filePath}&per_page=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const commits = await response.json();
    
    return commits.map(commit => ({
      sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: new Date(commit.commit.author.date),
      url: commit.html_url
    }));
  }

  async verifyConnection() {
    if (!this.token || !this.owner || !this.repo) {
      return false;
    }

    try {
      const url = `${GITHUB_API_BASE}/repos/${this.owner}/${this.repo}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export default new GitHubAPI();

// Made with Bob
