module.exports = {
    html(token) {
        const body = `WELCOME to PDC of UCSC<br/>
                        <br/><h2> You have been enrolled to pdc</h2>
                        <br/>
                        <br/>
                        <p>proceed with this link</p>
                        <a href="http://localhost:3000/setPassword/${token}">set new password<a>
                        <br/>
                        <h3>Thank you !!!</h3>
                        `
        return body;
    }
}