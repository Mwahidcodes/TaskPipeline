pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Fetching latest code from GitHub...'
                checkout scm
            }
        }

        stage('SonarQube Static Analysis') {
            steps {
                echo 'Executing SonarQube Code Scanning...'
                sh '''
                docker run --rm -v "${WORKSPACE}:/usr/src" sonarsource/sonar-scanner-cli \
                  -Dsonar.projectKey=TaskPipeline \
                  -Dsonar.sources=. \
                  -Dsonar.host.url=http://13.48.246.48:9000 \
                  -Dsonar.token=squ_ec1ebe09945b0ee9234e91c63e8163cd8cc9650d
                '''
            }
        }

        stage('Build & Push Docker Images') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "docker build -t ${DOCKER_USER}/taskpipeline-backend:latest ./backend"
                        sh "docker build -t ${DOCKER_USER}/taskpipeline-frontend:latest ./frontend"
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${DOCKER_USER}/taskpipeline-backend:latest"
                        sh "docker push ${DOCKER_USER}/taskpipeline-frontend:latest"
                    }
                }
            }
        }

        stage('Trivy Container Scanning') {
            steps {
                echo 'Scanning Docker images for vulnerabilities...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            # Backend Scan
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL ${DOCKER_USER}/taskpipeline-backend:latest
                            
                            # Frontend Scan
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL ${DOCKER_USER}/taskpipeline-frontend:latest
                        '''
                    }
                }
            }
        }

        stage('Kubernetes Native Production Deployment') {
            steps {
                echo 'Deploying to MicroK8s Cluster via Ansible...'
                sshagent(['prod-server-key']) {
                    sh 'ansible-playbook -i ansible/hosts ansible/playbook.yml'
                }
            }
        }
    }
}