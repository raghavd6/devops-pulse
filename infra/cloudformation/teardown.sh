
#!/usr/bin/env bash
set -euo pipefail
STACK_NAME=${STACK_NAME:-devops-pulse}
REGION=${REGION:-eu-west-2}

aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$REGION"
echo "Delete requested. Check stack status with: aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION"
