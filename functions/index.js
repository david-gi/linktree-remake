'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

exports.click = functions.https.onRequest((req, res) => {
    console.log(req.query)
    var ref = admin.firestore().collection("sections").doc(req.query.x)
    ref.get().then(r => {
        if(r.exists){
            var s = r.data()
            var newClicks = s.Clicks ? s.Clicks + 1 : 1
            ref.set({Clicks: newClicks}, { merge: true })
        }
        res.send("OK")
        return
    })
    .catch(e => {
        console.log(e);
    })
    return
})
exports.view = functions.https.onRequest((req, res) => {
    console.log(req.query)
    var ref = admin.firestore().collection("accounts").where("Username", "==", req.query.x)
    ref.get().then(r => {
        if(!r.empty){
            var s = r.docs[0].data()
            var newCount = s.Views ? s.Views + 1 : 1
            admin.firestore().collection("accounts").doc(r.docs[0].id).set({Views: newCount}, { merge: true })
        }
        res.send("OK")
        return
    })
    .catch(e => {
        console.log(e);
    })
    return
})