
#!/usr/bin/env bash
set -euo pipefail
STACK_NAME=${STACK_NAME:-devops-pulse}
REGION=${REGION:-eu-west-2}
PARAM_FILE=${PARAM_FILE:-infra/cloudformation/parameters.json}
TEMPLATE_FILE=${TEMPLATE_FILE:-infra/cloudformation/devops-pulse-ec2.yaml}

if ! command -v aws >/dev/null; then
  echo "aws CLI not found. Install AWS CLI and configure credentials." >&2
  exit 1
fi

aws cloudformation deploy   --stack-name "$STACK_NAME"   --region "$REGION"   --template-file "$TEMPLATE_FILE"   --parameter-overrides $(jq -r '.ParameterOverrides | to_entries | map("\(.key)=\(.value)") | join(" ")' "$PARAM_FILE")   --capabilities CAPABILITY_NAMED_IAM   --no-fail-on-empty-changeset

aws cloudformation describe-stacks --stack-name "$STACK_NAME" --region "$REGION"   --query 'Stacks[0].Outputs' --output table
