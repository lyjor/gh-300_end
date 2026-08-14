#\!/bin/bash

# Configuration
API_URL="http://127.0.0.1:3000/api"
EMAIL_ADMIN="admin@escola.local"
PASSWORD_ADMIN="Admin@123"
TIMESTAMP=$(date +%s)
TEST_EMAIL="aluno.exec.arm.${TIMESTAMP}@escola.local"
TEST_NAME="Aluno Execucao ARM"
UPDATED_NAME="Aluno Execucao ARM Atualizado"

echo "=== 1) LOGIN IN /api/auth/login ==="
LOGIN_RES=$(curl -s -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL_ADMIN}\",\"password\":\"${PASSWORD_ADMIN}\"}")

LOGIN_STATUS=$(echo "$LOGIN_RES" | grep "HTTP/" | head -n 1 | awk '{print $2}')
TOKEN=$(echo "$LOGIN_RES" | awk '/^\r?$/ {flag=1; next} flag {print}' | jq -r '.token // empty')

echo "Status: $LOGIN_STATUS"
if [ -z "$TOKEN" ]; then
  echo "Error: Token could not be retrieved"
  exit 1
fi
echo "Token: ${TOKEN:0:15}..."

echo ""
echo "=== 2) GET /api/alunos (Initial State & Discovery) ==="
GET_ALUNOS_RES=$(curl -s -i -H "Authorization: Bearer $TOKEN" "${API_URL}/alunos")
GET_ALUNOS_STATUS=$(echo "$GET_ALUNOS_RGET_ALUNOS "HGET_ALUNOSad -n GET_ALUNOS_STATUS=$(echo "$GET_AALUNGET_ALUNOS_STATUS=$(echo "$_RES" | awk '/^\r?$/ {flag=1; next} flag {print}'GET_ALUNOS_STATUS=$(echo "$GET_ALUNOS_RGET_ALUNOS "H sGET_ALUNOS_STATUS=$(echo "$Gt element's idTurma
VAL_ID_TURMA=$(echo "$GET_ALUNOS_BODY" | jq -r '. | map(select(.idTurma \!= null))[0].idTurma // empty')

if [ -z "$VAL_Iif [ -z "$VAL_Iif [ -z "$VAL_I" == "null" ]; then
  echo "No valid idTurma found in student list, defaulting to 1..."
  VAL_ID_TURMA=1
fi
echo "Selected idTurma: $VAL_ID_TURMA"

echo ""
echo "=== 3) POST /api/alunos (Create Student) ==="
POST_DATA=$(jq -n \
  --arg nome "$TEST_NAME" \
  --arg email "$TEST_EMAIL" \
  --argjson idTurma "$VAL_ID_TURMA" \
  '{nome  '{nome  '{nome  '{nome  '{no')

echo "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paec $TOecho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paecho "Paecho "Paecho "Paeececho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paec $TOecho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paecho "Paecho "Paecho "Paeececho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iecho "Paecho "Paecho "Paecho "Paecho$(cuecho "-iRM_RES=$(curl -s -i -H "Authorization: Bearer $TOKEN" "${API_URL}/alunos")
CONFIRM_STATUS=$(echo "$CONFIRM_RES" |CONFIRM_STATUS=$(echo "$CONFIRM_RES" |CONFIRM_STATUS=$(echo "$CY=CONFIRM_STATUS=$(echo "$CONFIRM_RES" |CONFIRM_STATUS=$(echo "$CONF}CONFIRMcho
