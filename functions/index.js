//const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.testkey)



exports.createStripeCustomer = functions.auth.user().onCreate(event => {

  console.log(event.providerData[0] + " " + event.providerData[0].email);

  // user auth data
  const user = event;

  console.log(user.email);
  
  // register Stripe user
  return stripe.customers.create({
  email: user.email
	})
	.then(customer => {
  /// update database with stripe customer id
  
  const data = { userId: user.uid, email: customer.email }
      
      const updates = {}
      updates[`/customers/${customer.id}`]     = data
      updates[`/users/${user.uid}/customerId`] = customer.id
      
      
      return admin.database().ref().update(updates);
	});
});



exports.createSubscription = functions.database.ref('/users/{userId}/membership').onWrite(event => {

  //console.log(event.after._path.split('/')[2]);

  console.log(event.after);

  var value = event.after.val();
                                
  const tokenId = value.token;
  const userId  = event.after._path.split('/')[2];
  
  
  if (!tokenId) throw new Error('token missing');
  
  if(value.amount === 500) {
    return admin.database()
    .ref(`/users/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then((user) => {
      
      return stripe.customers.createSource(user.customerId, {
        source: tokenId
      });
  
    })
    .then((customer) => {
  
      console.log(customer);
      return stripe.subscriptions.create({
        customer: customer.customer,
        //source: tokenId,
        items: [
              {
                plan: 'plan_EgUR5NjKOEe3in',
              },
            ],
        trial_period_days: 15,
          });
        
      })
      
      .then(sub => {
          admin.database()
          .ref(`/users/${userId}/membership`)
          .update( {status: 'active', subscription: sub} )
          
      return true;
      
      
      })
      .catch(err => console.log(err))
  }

  else if(value.amount === 1000) {
    return admin.database()
    .ref(`/users/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then((user) => {
      
      return stripe.customers.createSource(user.customerId, {
        source: tokenId
      });
  
    })
    .then((customer) => {
  
      console.log(customer);
      return stripe.subscriptions.create({
        customer: customer.customer,
        //source: tokenId,
        items: [
              {
                plan: 'plan_EhiwcgVe8z43BN',
              },
            ],
        trial_period_days: 15,
          });
        
      })
      
      .then(sub => {
          admin.database()
          .ref(`/users/${userId}/membership`)
          .update( {status: 'active', subscription: sub} )
          
      return true;
      
      
      })
      .catch(err => console.log(err))
  }

  else {

      return admin.database()
      .ref(`/users/${userId}`)
      .once('value')
      .then(snapshot => snapshot.val())
      .then((user) => {
        
        return stripe.customers.createSource(user.customerId, {
          source: tokenId
        });
    
      })
      .then((customer) => {
    
        console.log(customer);
        return stripe.subscriptions.create({
          customer: customer.customer,
          //source: tokenId,
          items: [
                {
                  plan: 'plan_Ehix7PFuGmm8Mm',
                },
              ],
          trial_period_days: 15,
            });
          
        })
        
        .then(sub => {
            admin.database()
            .ref(`/users/${userId}/membership`)
            .update( {status: 'active', subscription: sub} )
            
        return true;
        
        
        })
        .catch(err => console.log(err))
    }
 
  })


// exports.stripeCharge = functions.database
// .ref('/payments/{userId}/{paymentId}')
// .onWrite( (change,context) => {

// const payment = change.after.val();
// const userId = context.params.userId;
// const paymentId = context.params.paymentId;
  

//   // checks if payment exists or if it has already been charged
//   if (!payment || payment.charge) return;

//   return admin.database()
//               .ref(`/users/${userId}`)
//               .once('value')
//               .then(snapshot => {
//                   return snapshot.val();
//                })
//                .then(customer => {

//                  const amount = payment.amount;
//                  const idempotency_key = paymentId;  // prevent duplicate charges
//                  const source = payment.token.id;
//                  const currency = 'usd';
//                  const charge = {amount, currency, source};


//                  return stripe.charges.create(charge, { idempotency_key });

//                })

//                .then(charge => {
//                     admin.database()
//                         .ref(`/payments/${userId}/${paymentId}/charge`)
//                         .set(charge);
//                     return true;
//                 })


// });
