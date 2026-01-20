Haloy supports shell completion for bash, zsh, fish, and PowerShell to make command usage faster and more convenient.

## Bash

### Temporary (current session only)

```bash
source <(haloy completion bash)
```

### Permanent

**Linux:**

```bash
haloy completion bash | sudo tee /etc/bash_completion.d/haloy > /dev/null
```

**macOS:**

```bash
haloy completion bash | sudo tee /usr/local/etc/bash_completion.d/haloy > /dev/null
```

## Zsh

Create completions directory and generate completion file:

```bash
mkdir -p ~/.local/share/zsh/site-functions
haloy completion zsh > ~/.local/share/zsh/site-functions/_haloy
```

Add to `~/.zshrc` (only needed once):

```bash
echo 'fpath=(~/.local/share/zsh/site-functions $fpath)' >> ~/.zshrc
echo 'autoload -U compinit && compinit' >> ~/.zshrc
```

Reload your shell or restart terminal:

```bash
source ~/.zshrc
```

## Fish

```bash
mkdir -p ~/.config/fish/completions
haloy completion fish > ~/.config/fish/completions/haloy.fish
```

## PowerShell

```powershell
haloy completion powershell > haloy.ps1
# Then source the file from your PowerShell profile
```

## What You Get

Shell completion provides:

- **Command completion**: `haloy dep<tab>` → `haloy deploy`
- **Subcommand completion**: `haloy server <tab>` shows `add`, `list`, `delete`
- **Flag completion**: `haloy deploy --t<tab>` → `haloy deploy --target`
- **File path completion**: Auto-complete configuration file paths
- **Target name completion**: Auto-complete target names for multi-target deployments

## Testing Completion

After setup, test that completion works:

```bash
haloy <tab><tab>      # Shows all available commands
haloy deploy --<tab>   # Shows all deploy flags
```

## Troubleshooting

If completion doesn't work:

1. **Ensure haloy is in your PATH**: Run `which haloy`
2. **Reload your shell**: Source your profile or restart terminal
3. **Check permissions**: Ensure completion files are readable
4. **Verify completion is enabled**: For bash, ensure bash-completion is installed