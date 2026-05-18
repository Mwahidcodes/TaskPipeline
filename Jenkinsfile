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
                // Yeh command Jenkins ko bolegi ke jo ansible folder aapne push kiya hy, usay run kare
                sh 'ansible-playbook -i ansible/hosts ansible/playbook.yml'
            }
        }

        stage('Simulate Docker Build') {
            steps {
                echo 'Building Share4Good Application Docker Images...'
                // Yahan hum aage chal kar real docker build commands dalenge
                sh 'docker --version'
            }
        }
    }
}