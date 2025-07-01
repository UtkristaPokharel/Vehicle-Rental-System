import { useLocation } from "react-router"


function VehicleDetails() {
    const location =useLocation();
    const {name,price,image,dateRange,id}= location.state || {}
  return (
  <>
<div>{name}</div>
<div>{price}</div>
<div>{image}</div>
<div>{dateRange}</div>
<div>{id}</div>
  </>
  )
}

export default VehicleDetails