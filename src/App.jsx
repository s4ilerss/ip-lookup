import { useState } from 'react' // importing usestate cus we will need it below
import './App.css' // contains the css

function App() {
  const API_KEY = import.meta.env.VITE_API_KEY //now i can use my api keys in this file, specifically when making a request to the API
  const [ip, setIp] = useState(''); // this is for the user input field, we store the information in here
  const [ipResponse, setIpResponse] = useState(''); // this is the state for the response from the api
  const [loading, setLoading] = useState(false) //this contains the loading, we set it to true just before the fetch because we need to fill that empty gap when u press "check", it displays the loading so that it looks more user friendly
  const [error, setError] = useState('') // we just use this state to store the error message and display it


// this function is for the input field, we set the ip state to the value of the input field, and if the input field is empty we reset the ipResponse and error states
  function handleInputChange(e) {
    const value = e.target.value
    setIp(value)
    if (!value) {
      setIpResponse('')
      setError('')
    }
  }

// this function is for the check button, we first check if the ip state is empty, if it is we return and do nothing, otherwise we set loading to true, reset the ipResponse and error states, then we make a fetch request to the api with the ip address as a query parameter, we also include the api key in the headers, then we handle the response, if the response is not valid we set the error state to "Invalid IP address.", otherwise we set the ipResponse state to the data from the api, and finally we set loading to false, if there is an error during the fetch request we catch it and set the error state to "Something went wrong. Please try again." and set loading to false
  function handleCheck() {
    if (!ip) { return }
    setLoading(true)
    setIpResponse('')
    setError('')
    fetch(`https://api.api-ninjas.com/v1/iplookup?address=${ip}`, {
      headers: {
        'X-Api-Key': API_KEY,
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.is_valid) {
          setError('Invalid IP address.')
        } else {
          setIpResponse(data)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Something went wrong. Please try again.')
        setLoading(false)
      })
  }

// this is the return statement, we have an input field and a button, we also have some conditional rendering to display the loading message, error message, and the region from the api response
  return (
    <div>
      <h1>IP Lookup</h1>
      <div className='main'>
        <input type="text" placeholder='enter ip address' onChange={handleInputChange}/>
        <button onClick={handleCheck}>Check</button>
      </div>

      {!ip && <p className='state-message'>Enter an IP to begin</p>}
      {loading && <p className='state-message'>Loading...</p>}
      {error && !loading && <p className='error-message'>{error}</p>}
      {ipResponse && !loading && <p>Region: {ipResponse.region}</p>}
    </div>
  );
}


export default App