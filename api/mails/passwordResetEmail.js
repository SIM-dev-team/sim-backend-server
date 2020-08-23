module.exports = {
    html(token) {
        const body = `Password Reset for PDC account<br/>
                        <br/><h2> you have requested to reset your password </h2>
                        <br/>
                        <p>password reset link :<a href="http://localhost:3000/setPassword/${token}"> verification link<a></p>
                        <br/>
                        <h3>Thank you !!!</h3>
                        `
        return body;
    }
}