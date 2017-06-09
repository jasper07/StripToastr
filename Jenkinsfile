pipeline {
  agent any
  stages {
    stage('Checkout') {
      steps {
          // Used only for non-Multibranch Pipelines
          // git 'https://github.com/rtyler/jhipster-sample-app'
          checkout scm
          stash includes: '**', name: 'ws', useDefaultExcludes: false
      }
    }
    stage('Build Backend') {
        agent {
            docker {
                image 'maven:3-alpine'
                args '-v /root/.m2:/root/.m2'
            }
        }
        steps {
            unstash 'ws'
            sh './mvnw -B -DskipTests=true clean compile package'
            stash name: 'war', includes: 'target/**/*.war'
        }
    }
    stage('Backend') {
        agent {
            docker {
                image 'maven:3-alpine'
                args '-v /root/.m2:/root/.m2'
            }
        }
        steps {
            parallel(
                'Unit' : {
                    unstash 'ws'
                    unstash 'war'
                    sh './mvnw -B test'
                    junit '**/surefire-reports/**/*.xml'
                },
                'Performance' : {
                    unstash 'ws'
                    unstash 'war'
                    // sh './mvnw -B gatling:execute'
                })
        }
    }
    stage('Test Frontend') {
        agent { docker 'node:alpine' }
        steps {
            unstash 'ws'
            sh 'yarn install'
            sh 'yarn global add gulp-cli'
            // sh 'gulp test'
        }
    }
    stage('Build Container') {
        agent {
            docker {
                image 'maven:3-alpine'
                args '-v /root/.m2:/root/.m2 -v /var/run/docker.sock:/var/run/docker.sock'
            }
        }
        steps {
            unstash 'ws'
            unstash 'war'
            sh './mvnw -B docker:build'
        }
    }
    stage('Deploy to Staging') {
        agent any
        steps {
            echo "Let's pretend a deployment is happening"
        }
    }
    stage('Deploy to production') {
        agent any
        steps {
            input message: 'Deploy to production?', ok: 'Fire zee missiles!'
            echo "Let's pretend a production deployment is happening"
        }
    }
  }
}
