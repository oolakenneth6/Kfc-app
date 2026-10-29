## KFC (Kentucky Fried Chicken) Clone 
---
<p>
This was a collaborative construct week project at Masai School.
Goal behind the project was to create a full stack clone of the KFC website as close as possible to the original one with all the major functionalities of this website, such as  Authentication, Landing Page & Food Gallery, Menu, User Cart, Checkout, Payment Gateway.
This project was built by a team of 6 developers in 5 Days. 
</p>

### Run locally

The backend and frontend are separate applications. Run them in two PowerShell
terminals from the project root:

**Terminal 1 — backend**

```powershell
cd .\Backend
npm run dev
```

Ensure `Backend\.env` contains a valid MongoDB connection setting
(`MONGO_URI` or `DATABASE`) and sets `PORT=8081`, which is the API port used by
the frontend. Set `SECRET_KEY` to a long random value and add the email address
of each authorized menu administrator to `ADMIN_EMAILS` as a comma-separated
list. An account must sign in with an allowlisted email before it can create,
update, or delete menu items; public menu reads remain available.
Copy `Backend\.env.example` to `Backend\.env` and
`frontend\kfc-app\.env.example` to `frontend\kfc-app\.env`. The frontend
example selects `REACT_APP_PAYMENT_MODE=demo`, which saves a clearly labeled
demo order without charging money or requesting fulfillment. To use
Razorpay's test checkout instead, set `REACT_APP_PAYMENT_MODE=razorpay`, then
replace the Razorpay placeholders with matching test API credentials from
your own [Razorpay Dashboard](https://dashboard.razorpay.com/). Keep the key
secret only in `Backend\.env`, and put the matching public key ID in
`frontend\kfc-app\.env`. Never expose or commit the key secret. For live
payments, complete Razorpay account activation and use live credentials.
Restart both apps after changing environment files. The payment API derives
Razorpay order amounts from the server-side menu, verifies signatures, and
captures authorized payments.

Menu read operations are available at `GET /api/product/menu` and
`GET /api/product/menu/:id`. Admin-only writes use
`POST /api/product/menu`, `PUT /api/product/menu/:id`, and
`DELETE /api/product/menu/:id`; send the login token in an
`Authorization: Bearer <token>` header. A menu item uses the `image`, `title`,
`desc`, `price`, and `type` string fields.

**Terminal 2 — frontend**

```powershell
cd .\frontend\kfc-app
npm start
```

Open [http://localhost:3000/menu](http://localhost:3000/menu). There is no
root-level `package.json`, so run `npm start` from `frontend\kfc-app`, not from
the project root. If the backend reports `EADDRINUSE` on port 8081, it is
already occupied; stop the existing backend with Ctrl+C in its terminal before
starting another instance.

* [Click Here](https://clone-kfc.netlify.app/ "KFC Clone") to view the deployed website.

<p>
KFC (Kentucky Fried Chicken) is an American fast food restaurant chain headquartered in Louisville, Kentucky, that specializes in fried chicken. 
It is the world's second-largest restaurant chain after McDonald's.
KFC was founded by Colonel Harland Sanders, an entrepreneur who began selling fried chicken from his roadside restaurant in Corbin, Kentucky. 
By branding himself as "Colonel Sanders", Harland became a prominent figure of American cultural history and his image remains widely used in KFC advertising to this day.
KFC was one of the first American fast-food chains to expand internationally, opening outlets in Canada, the United Kingdom, Mexico and Jamaica by the mid-1960s. 
</p>

### Credits
___
* Images: [kfc.com](https://www.kfc.com/)
* Content & Data: [kfc.com](https://www.kfc.com/)
* Icons: [React Icons](https://react-icons.github.io/react-icons/)
* References: [MDN Docs](https://developer.mozilla.org/en-US/ ) | [W3Schools](https://www.w3schools.com/) | [React Slick](https://react-slick.neostack.com/)

### Tech Stack
___

* HTML 5
* CSS 3
* JavaScript
* React JS
* Redux JS 
* Node JS
* Express JS
* MongoDB
* React Icons
* React Slick
* Git

### Features
___
* Authentication
* Landing Page & Food Gallery
* Menu
* User Cart
* Checkout
* Payment Gateway

### Screenshots
___
![screehshot](https://miro.medium.com/max/1400/1*fu995W5N5M0VbHGlpNJxPQ.jpeg)
<br/>
<br/>
![screehshot2](https://miro.medium.com/max/1400/1*OBk1DWRx516zaSBgJZ7PrA.jpeg)
<br/>
<br/>
![screehshot3](https://miro.medium.com/max/1400/1*WQIFiH_I3wTtJZxBQQOs9w.jpeg)
<br/>
<br/>
![screehshot4](https://miro.medium.com/max/1400/1*zkiNq-T3glOef708whgQaA.jpeg)
<br/>
<br/>
![screehshot5](https://miro.medium.com/max/1400/1*WMqWF6FwCcpr74x9piU_Ug.jpeg)
<br/>
<br/>
![screehshot5](https://miro.medium.com/max/1400/1*N_xfAdo9YiXeeyRjaAWc_w.jpeg)


### Team
___
 <ul>
        <li><a href="https://github.com/Nameh-Dhiman">Nameh Dhiman</a></li>
        <li><a href="https://github.com/suranaarpit">Arpit Surana</a></li>
        <li> <a href="https://github.com/AmanJaiswal0612">Aman Jaiswal</a> </li>
        <li><a href="https://github.com/mdarshadkhan1998">MD Arshad Khan</a></li>
        <li><a href="https://github.com/hlv-kakashi">Anupam Kumar</a></li>
        <li><a href="https://github.com/arpitchaudhary03">Arpit Chaudhary</a></li>
  </ul>
  
 ### Contributing
 ___
 Contributions are always welcome!<br><br>
 You can contribute with us to make this more functionable.
   
