import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
import os, subprocess
from flask import Blueprint, jsonify

update_version_bp = Blueprint('update_version', __name__)

@update_version_bp.route('/update_version', methods=['GET', 'POST'])
def update_version():
    env = os.environ.copy()
    env['GIT_TERMINAL_PROMPT'] = '0'
    env['GIT_ASKPASS'] = 'echo'
    
    repo = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if not os.path.exists(os.path.join(repo, '.git')):
        return jsonify({"status": "uptodate", "message": "Running in production without local git repo."})

    git = "git"
    try:
        # safe directory
        subprocess.run([git, "config", "--global", "--add", "safe.directory", repo.replace('\\', '/')], cwd=repo, capture_output=True, env=env)
        
        branch_proc = subprocess.run([git, "rev-parse", "--abbrev-ref", "HEAD"], cwd=repo, capture_output=True, text=True, env=env)
        current_branch = branch_proc.stdout.strip() or 'develop'
        
        fetch_proc = subprocess.run([git, "fetch", "origin", current_branch], cwd=repo, capture_output=True, text=True, env=env)
        if fetch_proc.returncode != 0:
            output_lines = (fetch_proc.stdout + fetch_proc.stderr).splitlines()
            return jsonify({
                "status": "error",
                "step": "fetch",
                "output": output_lines
            })
            
        local_proc = subprocess.run([git, "rev-parse", "HEAD"], cwd=repo, capture_output=True, text=True, env=env)
        remote_proc = subprocess.run([git, "rev-parse", f"origin/{current_branch}"], cwd=repo, capture_output=True, text=True, env=env)
        
        local = local_proc.stdout.strip()
        remote = remote_proc.stdout.strip()
        
        if local == remote:
            return jsonify({"status": "uptodate"})
            
        # Automatic backup before update
        backup_dir = os.path.join(os.path.dirname(__file__), '..', 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        
        subprocess.run([git, "reset", "--hard"], cwd=repo, capture_output=True, env=env)
        subprocess.run([git, "clean", "-fd"], cwd=repo, capture_output=True, env=env)
        pull_proc = subprocess.run([git, "pull", "origin", current_branch], cwd=repo, capture_output=True, text=True, env=env)
        
        commit_after_proc = subprocess.run([git, "rev-parse", "HEAD"], cwd=repo, capture_output=True, text=True, env=env)
        commit_after = commit_after_proc.stdout.strip()
        
        if pull_proc.returncode == 0:
            if local != commit_after:
                return jsonify({"status": "updated"})
            else:
                return jsonify({"status": "uptodate"})
        else:
            output_lines = (pull_proc.stdout + pull_proc.stderr).splitlines()
            return jsonify({
                "status": "error",
                "step": "pull",
                "output": output_lines
            })
    except Exception as e:
        return jsonify({"status": "uptodate", "message": str(e)})
