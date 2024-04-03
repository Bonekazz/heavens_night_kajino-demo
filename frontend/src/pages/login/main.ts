const nameinput = document.getElementById("username") as HTMLInputElement;
const passinput = document.getElementById("password") as HTMLInputElement;

const loginform = document.getElementById("login-form") as HTMLFormElement;

if(!loginform) throw new Error("form not found");
loginform.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const username = nameinput.value;
    const password = passinput.value;

    try {
        const dataFetch = await fetch("http://localhost:3000/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({username: username, password: password}),
            credentials: "include",
        })

        const response = await dataFetch.json();
        if(!response.success) return window.alert(response.message);

        const queryString = window.location.search;
        const params = new URLSearchParams(queryString);

        const nextPage = params.get("next");
        if(!nextPage) return window.location.href = "/";

        window.location.href = nextPage;



    } catch (error) {
        console.log(error);
    }
    
});