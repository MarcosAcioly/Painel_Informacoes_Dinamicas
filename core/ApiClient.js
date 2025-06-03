 class ApiClient {
    async get(url) {
        try{
            const response = await fetch(url);
            if(!response.ok){
                throw new Error('Erro na requisição');
            }
            return await response.json();
        }catch(pError){
            throw pError;
        }
    }
}

export {ApiClient}