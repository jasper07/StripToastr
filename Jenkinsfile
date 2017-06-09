pipeline {
  agent any
  stages {
    stage('init') {
      steps {
        echo 'hello world'
      }
    }
    stage('build') {
      steps {
        sh '''npm install
gulp test '''
      }
    }
  }
}