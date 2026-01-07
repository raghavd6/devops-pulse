
# DevOps Pulse – CloudFormation (EC2 + Docker Compose)

This folder contains Infrastructure as Code (IaC) that provisions a minimal AWS environment and an EC2 instance that installs Docker, clones your application repository, and starts the services with Docker Compose.

## What this proves for the assignment
- **IaC**: repeatable, auditable environment provisioning via CloudFormation.
- **CI/CD hook**: can be triggered from your pipeline (e.g., GitHub Actions) after build/test stages.
- **Developer stories & benefits**:
  - **Developer** – fast, consistent environment spin‑up; fewer “works on my machine” issues.
  - **Tester** – predictable infra for smoke/integration tests; health endpoint exposed.
  - **DevOps Engineer** – automated deployments; environment drift reduced.
  - **SRE** – simpler rollback/teardown; observability via health checks.

## Architecture
- VPC + Public Subnet
- Security Group (SSH 22, HTTP `AppHttpPort`, HTTPS 443)
- EC2 (Amazon Linux 2) with **UserData** that:
  1. Installs Docker and Git
  2. Clones your Git repo and checks out the specified branch
  3. Runs `docker compose up -d` using `ComposePath`

> **Note:** AWS Learner Lab may restrict IAM; this template avoids creating roles/policies. If you need ECR, S3, or CloudWatch agents, add IAM resources in a separate template and document the trade‑offs.

## Files
- `devops-pulse-ec2.yaml` – CloudFormation template
- `parameters.json` – your parameter values (edit from `parameters.example.json`)
- `deploy.sh` – deploys the stack
- `teardown.sh` – deletes the stack

## Usage
1. **Edit parameters**:
   ```json
   {
     "ParameterOverrides": {
       "KeyName": "your-keypair-name",
       "InstanceType": "t3.micro",
       "RepoUrl": "https://github.com/your-org/your-devops-pulse-repo",
       "Branch": "main",
       "ComposePath": "docker-compose.yml",
       "AppHttpPort": 80
     }
   }
   ```
   Save as `infra/cloudformation/parameters.json`.

2. **Deploy**:
   ```bash
   chmod +x infra/cloudformation/deploy.sh
   ./infra/cloudformation/deploy.sh
   ```
   The script prints stack outputs (including public IP/URL).

3. **Teardown**:
   ```bash
   chmod +x infra/cloudformation/teardown.sh
   ./infra/cloudformation/teardown.sh
   ```

## CI/CD Integration (GitHub Actions snippet)
Trigger infra deploy after build/test succeed:
```yaml
name: ci-cd
on:
  push:
    branches: [ main ]
jobs:
  build_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
  deploy_infra:
    needs: build_test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-2
      - name: Install jq
        run: sudo apt-get update && sudo apt-get install -y jq
      - name: Deploy CloudFormation
        run: |
          chmod +x infra/cloudformation/deploy.sh
          infra/cloudformation/deploy.sh
```

## Justification & Trade‑offs (talking points for your video)
- **Why EC2 + Docker Compose?** Works within Learner Lab constraints; avoids managed services IAM overhead.
- **Security**: SG restricts to HTTP/HTTPS/SSH. Add rate limiting/WAF at the edge if available.
- **Observability**: Health endpoint from your app; consider CloudWatch agent if permissions allow.
- **Scalability**: Single instance for demo; outline how you would move to ASG/ALB or ECS/EKS in a full‑permission environment.

## Replaceable parameters
- `RepoUrl` can point to public or private repo. For private, inject a **GitHub Personal Access Token (PAT)** via `UserData` or use SSM/Secrets Manager (if permitted) and `git clone https://<token>@github.com/...`.

## References (cite in your write‑up)
- AWS CloudFormation docs
- GitHub Actions Marketplace (security, Docker, deploy)
- DORA metrics (for effectiveness assessment)
