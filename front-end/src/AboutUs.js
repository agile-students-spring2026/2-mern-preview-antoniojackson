import { useState, useEffect } from 'react'
import axios from 'axios'
import './AboutUs.css'

const AboutUs = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
      .then(response => {
        setData(response.data)
      })
      .catch(err => {
        setError(err.message || 'Failed to load about content')
      })
      .finally(() => {
        setLoaded(true)
      })
  }, [])

  if (!loaded) return <p>Loading...</p>
  if (error) return <p className="error">{error}</p>
  if (!data) return null

  const { paragraphs, imageUrl } = data

  return (
    <>
      <h1>About Us</h1>
      <div className="AboutUs-content">
        {imageUrl && (
          <img src={imageUrl} alt="About us" className="AboutUs-photo" />
        )}
        <div className="AboutUs-text">
          {paragraphs && paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </>
  )
}

export default AboutUs
