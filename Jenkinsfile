def COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']
properties([parameters([booleanParam(defaultValue: false, description: 'A default value is set to false', name: 'ALTER_DB'), booleanParam(defaultValue: false, description: 'A default value is set to false', name: 'SYNC_DB')])])
pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        echo "Sync DB is set to ${env.SYNC_DB}"
        echo "Alter DB is set to ${env.ALTER_DB}"
        echo 'Building a docker image'
        sh './scripts/build'
      }
    }
    stage('deploy') {
      steps {
        echo 'Deployment is in progress'
        sh './scripts/deploy'
      }
    } 
  }
post {
     always {
            sh 'git show -s --pretty=%an > commit.txt'
            slackSend color: COLOR_MAP[currentBuild.currentResult], channel: 'kaaylabs-ci-alerts',
            message: "*${currentBuild.currentResult}:* Job ${env.JOB_NAME}\nAuthor Name:${readFile('commit.txt').trim()} \nBranch name: ${env.BRANCH_NAME}\nBuild number: ${env.BUILD_NUMBER}\nMore info at: ${env.BUILD_URL}"
            cleanWs()
     }
   }
}
