pipeline {
  agent {
    docker {
      image 'node:alpine'
    }
  }
  stages {
    stage("testing 123") {
       steps {
          sh 'node --version'
            }
      }
    stage('Checkout') {
      steps {
          checkout scm
      }
    }
    stage('Backend') {
        steps {
            parallel(
                'Unit' : {
                    echo "Let's pretend a deployment is happening"
                },
                'Performance' : {
                    echo "Let's pretend a deployment is happening"
                })
        }
    }
    stage('Test Frontend') {
        steps {
            sh 'npm install'
            sh 'gulp test'
        }
    }

    stage('Deploy to Staging') {
        steps {
            echo "Let's pretend a deployment is happening"
        }
    }
    stage('Deploy to production') {
        steps {
            input message: 'Deploy to production?', ok: 'Fire zee missiles!'
            echo "Let's pretend a production deployment is happening"
        }
    }
  }
}
