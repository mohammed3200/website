# Git History Security Remediation Guide

> [!WARNING]
> Sensitive credentials were committed to the repository history. Even if the current version of the files are redacted, the secrets remain in the Git history and are accessible to anyone with clone access. **You MUST purge these secrets from the history.**

## 1. Prerequisites

Install `git-filter-repo` (recommended) via Python:

```bash
pip install git-filter-repo
```

## 2. Purge Exposed Secrets

Run the following commands in the root of your repository to wipe all occurrences of the exposed strings from all commits, tags, and branches.

### exposed SMTP Password

```bash
git filter-repo --replace-text <(echo "COMPROMISED_SMTP_PASS==><REDACTED_SECRET>")
```

### exposed NEXTAUTH_SECRET

```bash
git filter-repo --replace-text <(echo "COMPROMISED_NEXTAUTH_SECRET==><REDACTED_SECRET>")
```

### exposed ADMIN_API_KEY

```bash
git filter-repo --replace-text <(echo "COMPROMISED_ADMIN_API_KEY==><REDACTED_SECRET>")
```

## 3. Force Push Changes

After filtering, you must force-push to the remote to update the server's history. **Coordinate with your team before doing this as it will rewrite history for all collaborators.**

```bash
git push origin --force --all
git push origin --force --tags
```

## 4. Credential Rotation (CRITICAL)

Rewriting history does not "unseal" the secrets that were already seen. You **MUST** rotate:

1. **Google App Password**: Revoke it at [Google Account](https://myaccount.google.com/apppasswords).
2. **NEXTAUTH_SECRET**: Generate a new one for production env vars.
3. **ADMIN_API_KEY**: Generate a new one for production env vars.

## 5. Alternative: BFG Repo-Cleaner

If you prefer BFG:

1. Create a `passwords.txt` containing the strings to remove.
2. Run: `bfg --replace-text passwords.txt`
3. Force push.
