import { useState } from 'react' // need usestate for the states below
import './App.css' // contains the css

// the free plan returns this string for the fields it doesnt give us, so we hide those rows
function isLocked(value) {
  return typeof value === 'string' && value.includes('premium subscribers only')
}

// one row of the results card, skipped entirely if the api didnt give us the value
function Row({ label, value }) {
  if (value === undefined || value === null || value === '' || isLocked(value)) { return null }
  return (
    <div className='row'>
      <span className='label'>{label}</span>
      <span className='value'>{value}</span>
    </div>
  )
}

function App() {
  const [ip, setIp] = useState(''); // whatever the user types in the input
  const [ipResponse, setIpResponse] = useState(null); // the response from the api
  const [loading, setLoading] = useState(false) // true while fetching, so the gap after "check" isnt empty
  const [error, setError] = useState('') // error message we show to the user

// keeps the ip state in sync with the input, and clears the old result if its emptied
  function handleInputChange(e) {
    const value = e.target.value
    setIp(value)
    if (!value) {
      setIpResponse(null)
      setError('')
    }
  }

// runs on the check button, asks our own /api/lookup (it holds the key) and stores either the data or an error
  function handleCheck() {
    if (!ip) { return }
    setLoading(true)
    setIpResponse(null)
    setError('')
    fetch(`/api/lookup?address=${encodeURIComponent(ip)}`)
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
        setError('Enter a valid address')
        setLoading(false)
      })
  }

// so you can just hit enter instead of clicking check
  function handleKeyDown(e) {
    if (e.key === 'Enter') { handleCheck() }
  }

// input + button, then we only show the message (or the result card) that applies right now
  return (
    <div className='page'>
      <h1>IP Lookup</h1>
      <p className='subtitle'>Enter an IP address to see where it is.</p>

      <div className='main'>
        <input
          type="text"
          placeholder='e.g. 12.123.123.123'
          value={ip}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleCheck}>Check</button>
      </div>

      {!ip && !loading && <p className='state-message'>Enter an IP to begin</p>}
      {loading && <p className='state-message'>Loading...</p>}
      {error && !loading && <p className='error-message'>{error}</p>}

      {ipResponse && !loading && (
        <div className='result'>
          <Row label='IP address' value={ipResponse.address} />
          <Row label='Country' value={ipResponse.country} />
          <Row label='Country code' value={ipResponse.country_code} />
          <Row label='Region' value={ipResponse.region} />
          <Row label='Region code' value={ipResponse.region_code} />
          <Row label='City' value={ipResponse.city} />
          <Row label='Timezone' value={ipResponse.timezone} />
          <Row label='Latitude' value={ipResponse.lat} />
          <Row label='Longitude' value={ipResponse.lon} />
        </div>
      )}
    </div>
  );
}


export default App
