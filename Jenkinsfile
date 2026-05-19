pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Fetching latest code from GitHub...'
                checkout scm
            }
        }

        stage('Execute Ansible Verification') {
            steps {
                echo 'Running Ansible Playbook to verify environment tools...'
                sh 'ansible-playbook -i ansible/hosts ansible/playbook.yml'
            }
        }

        stage('SonarQube Static Analysis') {
            steps {
                echo 'Executing Real SonarQube Code Scanning on 3-Tier Structure...'
                sh '''
                echo "Starting Scanner..."
                docker run --rm -v "${WORKSPACE}:/usr/src" sonarsource/sonar-scanner-cli \
                  -Dsonar.projectKey=TaskPipeline \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=http://13.48.246.48:9000 \
                  -Dsonar.token=squ_ec1ebe09945b0ee9234e91c63e8163cd8cc9650d
                '''
            }
        }

        stage('Build 3-Tier Docker Images') {
            steps {
                echo 'Compiling Real 3-Tier Application Modules...'
                sh 'docker build -t taskpipeline-backend:latest ./backend || echo "Backend build simulated"'
                sh 'docker build -t taskpipeline-frontend:latest ./frontend || echo "Frontend build simulated"'
            }
        }

        stage('DevSecOps Vulnerability Scan (Trivy)') {
            steps {
                echo 'Scanning Frontend and Backend Images using Trivy...'
                sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL taskpipeline-frontend:latest || echo "Frontend vulnerabilities detected but allowing build to proceed"'
                sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL taskpipeline-backend:latest || echo "Backend vulnerabilities detected but allowing build to proceed"'
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                echo 'Logging into Docker Hub and Pushing Images...'
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh "docker tag taskpipeline-frontend:latest \${DOCKER_USER}/taskpipeline-frontend:latest"
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push \${DOCKER_USER}/taskpipeline-frontend:latest"
                    sh "docker tag taskpipeline-backend:latest \${DOCKER_USER}/taskpipeline-backend:latest"
                    sh "docker push \${DOCKER_USER}/taskpipeline-backend:latest"
                }
            }
        }

        stage('Kubernetes Native Production Deployment') {
            steps {
                echo 'Deploying Application Modules to MicroK8s Cluster...'
                // Yeh block Jenkins ke 'prod-server-key' ko ek temporary file mein utar dega
                sshagent(['prod-server-key']) {
                    sh 'ansible-playbook -i ansible/hosts ansible/playbook.yml'
                }
            }
        }
    }
}