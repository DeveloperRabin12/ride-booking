import React from 'react'
import 'remixicon/fonts/remixicon.css'

const LocationSearch = ({ suggestions =[], setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {
    // console.log(props)
    // const locations=[
    //   'suryabinayak bus stop',
    //   'kathmandu, thamel',
    //   'kathmandu, new road',
    //   'kirtipur, bagmati',
    //   'bungamati,lalitpur'
    // ]  

     const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        // setVehiclePanel(true)
        // setPanelOpen(false)
    }

  return (
    <div>

      
      {
        suggestions.map(function(elem,idx){
      return  <div key={idx} onClick={()=>{
  
            console.log(elem)
         handleSuggestionClick(elem)
        // props.setVehiclePanel(true)
        // props.setLocationSuggest(false)
       
      }} className='flex gap-3 border-2 active:border-black rounded-xl items-center my-2 justify-start'>
                  <h2 className='bg-[#eee] h-10 flex  items-center justify-center w-14 rounded-full'><i className="ri-map-pin-line text-xl"></i></h2>
                  <h4 className='font-medium'>{elem}</h4>
            </div>
        })
      }
      
    </div>
  )
}

export default LocationSearch