
module.exports = {

    name:'qrpromptpay.layout',
    version:'0.0.1',
    env:process.env.NODE_ENV || 'development',
    t00:{
        id:'00',
        len:'02',
        value:'01',
        type:'N',
        des:'Playloadformat'
    },
    t01:{
        id:'01',
        len:'02',
        value:'11',
        type:'N',
        des:'Point of initiation'
    },    
    t29:{
        id:'29',
        len_ol:'dynamic',
        v_aid:{
            id:'00',
            len:'16',
            value:'A000000677010111'
        },
        v_mobile:{
                id:'01',
                len:'13',
                value_op:'OnProfile',
                des:'Mobile'
            },
        v_nid:{
                id:'02',
                len:'13',
                value_op:'OnProfile',
                des:' National ID or Tax ID'
            },
        v_ewall:{
                id:'03',
                len:'15',
                value_op:'OnProfile',
                des:'e-wallet ID'
        },
        type:'Ans',
        des:'Merchant Identifier-Personal'
    },
    t30:{
        id:'30',
        len_ol:'dynamic',
        v_aid:{
            id:'00',
            len:'16',
            value:'A000000677010112'
        },
        v_billerid:{
            id:'01',
            len:'15',
            value_op:'OnProfile'
        },
        v_ref1:{
            id:'02',
            len_ol:'dynamic',
            value_oc:'OnClient'
        },
        v_ref2:{
            id:'03',
            len_ol:'dynamic',
            value_oc:'OnClient'
        },
        type:'Ans',
        des:'Merchant Identifier-Personal'
    },
    t53:{
        id:'53',
        len:'03',
        value:'764',
        type:'N',
        des:'Transaction Currency Code'
    },
    t54:{
        id:'54',
        len_ol:'OnLogic',
        value_oc:'OnClient',
        type:'ANS',
        des:'Transaction Amount'
    },
    t58:{
        id:'58',
        len:'02',
        value:'TH',
        type:'S',
        des:'Country Code'
    },
    t59:{
        id:'59',
        len_ol:'OnLogic',
        value_op:'OnProfile',
        type:'ANS',
        des:'Merchant Name'
    },
    t60:{
        id:'60',
        len_ol:'OnLogic',
        value_ol:'OnLogic',
        type:'ANS',
        des:'Merchant City'
    },
    t62:{
        id:'62',
        len_ol:'OnLogic',
        v_termid:{
            id:'07',
            len_ol:'OnLogic',
            value_oc:'OnClient',
            type:'ANS'
        },
        type:'ANS',
        des:'Additional Data Field Template'
    },
    t63:{
        id:'63',
        len:'04',
        value_ol:'OnLogic',
        type:'AN',
        des:'CRC'
    }
}

