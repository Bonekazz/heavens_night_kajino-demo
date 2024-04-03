

async function fetchData() {
    
    try {
        const dataFetch = await fetch("http://localhost:3000/api/rooms", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            
        })

        const response = await dataFetch.json();
        if(!response.success) return window.location.href = response.redirect;
        console.log(response.rooms);
    } catch (error) {
        console.log(error);
    }
    
};

fetchData();