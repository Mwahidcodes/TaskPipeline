pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub successfully...'
            }
        }

        stage('Check Environment/Docker') {
            steps {
                echo 'Verifying environment software versions...'
                sh 'docker --version'
                sh 'java -version'
            }
        }

        stage('Simulate Build & Test') {
            steps {
                echo 'Building and testing application modules...'
            }
        }
    }
}