function deleteCustomer() {
  const customerID = document.getElementById('delete-customer-select').value
  if (!customerID) return

  let data = {
    id: customerID,
  }
  let xhttp = new XMLHttpRequest()
  xhttp.open('DELETE', '/delete-customer-form', true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 204) {
      window.location = '/customers'
    } else if (xhttp.readyState == 4 && xhttp.status != 204) {
      console.log('There was an error with the input.')
    }
  }
  xhttp.send(JSON.stringify(data))
}
