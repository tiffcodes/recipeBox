import React from 'react';

export default class SignIn extends React.Component {
	constructor() {
		super();
	}	

	signIn(e) {
		e.preventDefault();
		const user = {
			email: this.email.value,
			password: this.password.value
		};

		var emailTest = /^([\w-\.]+)@([\w-]+\.)+[\w-]{2,6}?$/;

		if(!emailTest.test(user.email)) {
			alert('Please enter a valid email address');
			return;
		}
		
		firebase.auth().signInWithEmailAndPassword(user.email, user.password)
		.catch( (error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			console.log(errorCode, errorMessage);
		}).then((response) => {
			// console.log(response);
		});
	}
	
	
	render() {
		return (
			<form onSubmit={(e) => this.signIn.call(this,e) } className="signIn" autoComplete="off" >
				<h2>Sign in:</h2>
				<div>
					<label>Enter your email address:</label>
					<input type="text" onBlur="" ref={ref => this.email = ref} autoComplete="off" />
				</div>
				<div>
					<label>Enter your password:</label>
					<input type="password" ref={ref => this.password = ref} autoComplete="off" />
				</div>
				<input type="submit" value="Sign In" />
				<a className="forgotPassword" href="mailto:tiffany@tiffanydanielle.com">Forgot Password? Email us with your email address</a>
			</form>
		);
	}
}



