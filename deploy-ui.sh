

#!/bin/bash
# === CONFIGURE THESE ===
#sudo chmod a+x install.sh
EC2_USER="ubuntu"
EC2_IP="ec2-54-81-82-138.compute-1.amazonaws.com"               # e.g., 3.214.246.121
REMOTE_TMP_DIR="/home/ubuntu/tmp_smartdochubui"
REMOTE_TARGET_DIR="/var/www/smartdochubui"
LOCAL_BUILD_DIR="./docs"  # Angular build output folder
KEY_PATH="./somytech.pem"

# === STEP 1: Create temp folder and target dir on EC2 ===
echo "Creating temp and target directories on EC2..."
ssh -i ${KEY_PATH} ${EC2_USER}@${EC2_IP} "mkdir -p ${REMOTE_TMP_DIR} ${REMOTE_TARGET_DIR}"

# === STEP 2: Copy build files to temp folder ===
echo "Uploading build files to EC2 temp folder..."
scp -i ${KEY_PATH} -r ${LOCAL_BUILD_DIR}/* ${EC2_USER}@${EC2_IP}:${REMOTE_TMP_DIR}

# === STEP 3: Move files from temp to /var/www/ (with sudo) ===
echo "Moving files to /var/www/..."
ssh -i ${KEY_PATH} ${EC2_USER}@${EC2_IP} "sudo rm -rf ${REMOTE_TARGET_DIR}/* && sudo mv ${REMOTE_TMP_DIR}/* ${REMOTE_TARGET_DIR}/ && rm -rf ${REMOTE_TMP_DIR}"

# === STEP 4: Set permissions (optional but safe) ===
ssh -i ${KEY_PATH}  ${EC2_USER}@${EC2_IP} "sudo chown -R www-data:www-data ${REMOTE_TARGET_DIR} && sudo chmod -R 755 ${REMOTE_TARGET_DIR}"

# === STEP 5: Restart NGINX ===
echo "Restarting NGINX on EC2..."
ssh -i ${KEY_PATH}  ${EC2_USER}@${EC2_IP} "sudo systemctl restart nginx"

echo "✅ Deployment complete! Angular is live on https://${EC2_IP}/"

