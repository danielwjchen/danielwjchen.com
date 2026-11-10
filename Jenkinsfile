pipeline {
    agent any

    environment {
        REMOTE_USER       = 'root'
        REMOTE_HOST       = '45.55.51.139'
        REMOTE_APP_DIR    = '/var/www/danielwjchen.com'
        SSH_CREDENTIAL_ID = 'ed25519'
        APP_NAME          = 'danielwjchen.com'

        GITHUB_REPO_URL   = 'git@github.com:danielwjchen/danielwjchen.com.git'
        GITHUB_BRANCH     = 'master'
        GITHUB_CRED_ID    = 'ed25519'
    }
    
    tools {
        nodejs 'node24'
    }

    stages {
        stage('Checkout master') {
            options { timeout(time: 5, unit: 'MINUTES') }
            steps {
                echo "Fetching latest source code from GitHub..."
                checkout([$class: 'GitSCM', 
                    branches: [[name: "*/${env.GITHUB_BRANCH}"]], 
                    userRemoteConfigs: [[url: env.GITHUB_REPO_URL, credentialsId: env.GITHUB_CRED_ID]]
                ])
            }
        }
        stage('Build Application') {
            steps {

                echo "Compiling application using Jenkins NodeJS Tool Setup..."
                sh '''
                    echo "Node version in use: \$(node -v)"
                    echo "NPM version in use: \$(npm -v)"
                    
                    # Install dependencies and build production artifacts cleanly
                    npm ci
                    npm run deploy
                    npm prune --omit=dev
                '''
            }
        }

        stage('Publish Artifacts via SSH') {
            steps {
                echo "Transferring build files to remote host..."
                sshagent([SSH_CREDENTIAL_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} \
                            "mkdir -p ${REMOTE_APP_DIR}"
                    """
                    
                    sh """
                    rsync -e "ssh -o StrictHostKeyChecking=no " \
                        -az \
                        --exclude='.git' . \
                        --exclude 'public/' \
                        --exclude 'logs/' \
                        --exclude 'pids/' \
                        --exclude '*.pid' \
                        --exclude '*.sqlite' \
                        --exclude '*.backup' \
                        --exclude 'configs.json' \
                        --exclude '.env' \
                        --exclude 'secrets.json' \
                        --exclude 'e2e/test-results/' \
                        --exclude 'e2e/playwright-report/' \
                        --exclude '.last-deploy' \
                        ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_APP_DIR}/
                """
                }
            }
        }
        
        
        stage('Restart') {
            steps {
                echo "Transferring build files to remote host..."
                sshagent([SSH_CREDENTIAL_ID]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST}  "
                            cd ${REMOTE_APP_DIR} && 
                            chmod +x ./deploy.sh &&
                            ./deploy.sh ${APP_NAME}
                        "
                    """
                }
            }
        }
    }
    post {
        success {
            echo "Deployed successfully."
        }
        failure {
            echo "Deploy failed."
        }
    }
}
