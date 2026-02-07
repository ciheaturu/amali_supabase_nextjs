import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AddBuilding() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [classification, setClassification] = useState('Residential')
  const [occupants, setOccupants] = useState('')

  async function save() {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('buildings').insert({
      user_id: user.id,
      name,
      address,
      latitude,
      longitude,
      classification,
      occupants
    })

    if (error) alert(error.message)
    else window.location.href = '/city'
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Add Building</h2>

      <input placeholder="Building name" onChange={e => setName(e.target.value)} /><br />
      <input placeholder="Address" onChange={e => setAddress(e.target.value)} /><br />
      <input placeholder="Latitude" onChange={e => setLatitude(e.target.value)} /><br />
      <input placeholder="Longitude" onChange={e => setLongitude(e.target.value)} /><br />

      <select onChange={e => setClassification(e.target.value)}>
        <option>Residential</option>
        <option>Commercial</option>
        <option>Public</option>
      </select><br />

      <input placeholder="Occupants" onChange={e => setOccupants(e.target.value)} /><br /><br />

      <button onClick={save}>Save</button>
    </div>
  )
}
