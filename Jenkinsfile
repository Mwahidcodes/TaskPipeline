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

        stage('Build Docker Image') {
            steps {
                echo 'Compiling Share4Good Application Module into Docker Image...'
                // Yeh command Dockerfile ko read karke local image build karegi
                sh 'docker build -t share4good-app:latest .'
            }
        }
    }
}