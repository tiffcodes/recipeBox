import React from 'react';

export default class SignUp extends React.Component {
	constructor() {
		super();
	}	

	signUp(e) {
		e.preventDefault();
		const user = {
			email: this.email.value,
			password: this.password.value,
			confirm: this.confirmPassword.value
		};

		var emailTest = /^([\w-\.]+)@([\w-]+\.)+[\w-]{2,6}?$/;

		if(!emailTest.test(user.email)) {
			alert('Please use a valid email address');
			return;
		}

		if(user.confirm !== user.password) {
			alert('Please make sure you passwords match.');
			return;
		}

		firebase.auth()
			.createUserWithEmailAndPassword(user.email, user.password)
			.catch(function(error) {
			  var errorCode = error.code;
			  var errorMessage = error.message;

			  if ( errorMessage === "auth/email-already-in-use") {
			  	alert('Email already in use');
			  } else if ( errorMessage === "auth/invalid-email") {
			  	alert('Email invalid');
			  } else if (errorMessage === "auth/operation-not-allowed") {
			  	alert('Oops we\'re not allowing emails right now. Please sign up with Facebook or gmail')
			  } else if (errorMessage === "auth/weak-password") {
			  	alert('Yikes your password isn\'t strong enough. Try again but maybe throw in a cap or exclamation point??');
			  } else {
			  	alert('ah! Something went wrong. Try again in a little while. Maybe turn it off then on again?');
			  }
		}).then(function(user) {
			// console.log(user);
		});
	}
	
	
	render() {
		return (
			<div className="signUp">
				<form onSubmit={(e) => this.signUp.call(this,e) } >
					<h2>Sign Up:</h2>
					<div>
						<label>Enter your email address:</label>
						<input type="text" onBlur="" ref={ref => this.email = ref} autoComplete="off" />
					</div>
					<div>
						<label>Enter a password:</label>
						<input type="password" ref={ref => this.password = ref} autoComplete="off"/>
					</div>
					<div>
						<label>Re-enter your password:</label>
						<input type="password" ref={ref => this.confirmPassword = ref} autoComplete="off"/>
					</div>
					<input type="submit" value="Sign Up" />
				</form>
			</div>
		);
	}
}
