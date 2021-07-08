import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';


class Auth extends Component {

    constructor(props){
        super(props);
        this.state = {
            isSignedIn : false
        };
        this.firebaseConfig = {
            apiKey: "AIzaSyD0LfTMcdqD-MfLcTW6-RN9RwHklYkpqBQ",
            authDomain: "pokemon-berry.firebaseapp.com",
            projectId: "pokemon-berry",
            storageBucket: "pokemon-berry.appspot.com",
            messagingSenderId: "688306973408",
            appId: "1:688306973408:web:9057ee09f890c4fd423e85",
            measurementId: "G-8SXCEB8PEZ"
          };
        
          // Configure FirebaseUI.
        this.uiConfig = {
          // Popup signin flow rather than redirect flow.
          signInFlow: 'popup',
          // We will display Google and Facebook as auth providers.
          signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
          ],
          callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false,
          },
        };
          
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(this.firebaseConfig);
            firebase.auth().onAuthStateChanged(user => {
                window._client.auth._id = user.uid;
                window._client.auth.email = user.email;
                window._client.auth.displayName = user.displayName;
                this.setState({isSignedIn: !!user});
          });
        }
          
    }

  render() {
  
    if (!this.state.isSignedIn) {
        return (
            <div>
            <h1>Pokemon Berry</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
          </div>
        );
    }
    else{
        return(
            <div>
            <h1>Pokemon Berry</h1>
            <Link to={'./game'}>
                <button className="nes-btn is-success">
                    Game
                </button>
            </Link>
            <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
            <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
          </div>
        )
    }
  }
}

export default Auth;
