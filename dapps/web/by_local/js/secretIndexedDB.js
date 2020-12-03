var ZTIMES = ZTIMES || {};

ZTIMES.CRYPTOGRAPH = {
  init: function(){
  },
  test: function(){
  },
  GetSecret: async function(){
    const keyExArray = await this.generateKeyEx();
    const ivU8A32 = this.getIv();
    const keyExU8A32 = ZTIMES.LIB.ToU8Array(keyExArray);
    const secret = {keyEx:keyExU8A32,iv:ivU8A32};
    return secret;
  },
  getIv: function(){
    //@note. The iv must never be reused with a given key.
    const iv = window.crypto.getRandomValues(new Uint8Array(32));
    return iv;
  },
  ToSecretHex: async function(password,uid,secret){
    const it = this;
    const secretU32AC = await (()=>{
      return new Promise((resolve,reject)=>{
        const seed = password + uid;
        it.getHashArray(seed).then((seedU32A)=>{
          const keyExU32AC = it.toBarnham(seedU32A,secret.keyEx);
          const ivU32AC = it.toBarnham(seedU32A,secret.iv);
          const secretU32AC = it.concatArray(keyExU32AC,ivU32AC);
          resolve(secretU32AC);   //U32AC : uint 32bytes array chipher
        });
      });
    })();
    return secretU32AC;
  },
  FromSecretHex: async function(password,uid,secretU32AC){
    const it = this;
    const secret = await (()=>{
      return new Promise((resolve,reject)=>{
        const seed = password + uid;
        it.getHashArray(seed).then((seedU32A)=>{
          const keyExU32AC = secretU32AC.slice(0,32);
          const ivU32AC = secretU32AC.slice(32,64);
          const keyEx = it.toBarnham(seedU32A,keyExU32AC);
          const iv = it.toBarnham(seedU32A,ivU32AC);
          const secret = {keyEx:keyEx,iv:iv};
          resolve(secret);
        });
      });
    })();
    return secret;
  },
  getHashArray: async function(text){
    const hashArray = await (()=>{
      return new Promise((resolve,reject)=>{
        const array = ZTIMES.LIB.TextToArray(text);
        window.crypto.subtle.digest('SHA-256',array).then((hashBuffer)=>{
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          resolve(hashArray);
        });
      });
    })();
    return hashArray;
  },
  GetHashHex: async function(text){
    const hashArray = await this.getHashArray(text);
    const hashHex = ZTIMES.LIB.ToHex(hashArray);
    return hashHex;
  },
  toBarnham: function(U8ArrayP,U8ArrayQ){
    const arrayLen = U8ArrayP.length;
    if(arrayLen !== U8ArrayQ.length){
      console.log("[ERR]toBarnham");
      return;
    }
    let U8ArrayR = new Uint8Array(arrayLen);
    for(let cnt=0;cnt<arrayLen;cnt+=1){
      U8ArrayR[cnt] = U8ArrayP[cnt] ^ U8ArrayQ[cnt];
    }
    return U8ArrayR;
  },
  concatArray: function(uint8ArrayP,uint8ArrayQ){
    let uint8ArrayR = new Uint8Array(uint8ArrayP.length + uint8ArrayQ.length);
    uint8ArrayR.set(uint8ArrayP);
    uint8ArrayR.set(uint8ArrayQ,uint8ArrayP.length);
    return uint8ArrayR;
  },
  generateKeyEx: async function(){
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/generateKey
    const key = await window.crypto.subtle.generateKey(
      {name:"AES-GCM",length:256},
      true,
      ["encrypt","decrypt"]
    );
    const keyEx = await this.exportKey(key);
    return keyEx;
  },
  Encrypt: async function(keyEx,iv,text){
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
    const key = await this.importKey(keyEx);
    const array = ZTIMES.LIB.TextToArray(text);
    const encryptedArray = await window.crypto.subtle.encrypt(
      {name:"AES-GCM",iv:iv},
      key,
      array
    );
    return encryptedArray;
  },
  Decrypt: async function(keyEx,iv,encryptedArray){
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt
    const key = await this.importKey(keyEx);
    const array = await window.crypto.subtle.decrypt(
      {name:"AES-GCM",iv:iv},
      key,
      encryptedArray
    );
    const text = ZTIMES.LIB.ArrayToText(array);
    return text;
  },
  exportKey: async function(key){
    const keyEx = await window.crypto.subtle.exportKey(
      "raw",
      key
    );
    return keyEx;
  },
  importKey: async function(keyEx){
    const key = await window.crypto.subtle.importKey(
      "raw",
      keyEx,
      "AES-GCM",
      true,
      ["encrypt","decrypt"]
    );
    return key;
  },
}

ZTIMES.SECRETDB = {
  password: "",
  uid: "",
  secret: {},
  dbCaches: {},
  init: function(){
    this.password = "This is a password.";
    this.uid = "0x123456789";
    // this.uid = "0x111111111";
  },
  test: function(){
    const it = this;
    this.loadSecret(it).then(()=>{
      it.loadDatabase(it).then(()=>{
        console.log(it.dbCaches);
        it.test1().then(()=>{
          it.test4().then(()=>{
            it.test2();
            it.test3();
          });
        });
      });
    });
  },
  test1: function(){
    const record0 = {recordKey:'hash0', content:'I am a zombie.'};
    const record1 = {recordKey:'hash1', content:'If zombie bites you,'};
    const record2 = {recordKey:'hash2', content:'We are zombies.'};
    const params = {
      dbName:'/Ether0/Book0',
      version:1,
      tables:{
        // tableName : recordList
        '/Ether0/Book0/Sheet0':[record0,record1],
        '/Ether0/Book0/Sheet1':[record2],
      },
    };
    const it = this;
    const promise = this.StoreDatabase(it,params);
    return promise;
  },
  test2: function(){
    const dbName = '/Ether0/Book0';
    const tableName = '/Ether0/Book0/Sheet0';
    const recordKey = 'hash0';
    const promise = this.GetRecord(dbName,tableName,recordKey).then((record)=>{
      console.log(record);
    });
    return promise;
  },
  test3: function(){
    const dbName = '/Ether0/Book0';
    const tableName = '/Ether0/Book0/Sheet0';
    const promise = this.GetRecordList(dbName,tableName).then((recordList)=>{
      console.log(recordList);
    });
    return promise;
  },
  test4: async function(){
    const dbName = '/Ether0/Book0';
    const tableName = '/Ether0/Book0/Sheet0';
    const record10 = {recordKey:'hash10', content:'Join us.'};
    const promise = this.PutRecord(dbName,tableName,record10);
    return promise;
  },
  ShowImage: function(input){
    console.log("From Browser");
    const it = ZTIMES.SECRETDB;
    const el = document.getElementById("iImage");
    const file = input.files[0];
    if(file === undefined){
      el.src = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const blobURL = reader.result;
      it.testSaveImage(blobURL).then(async function(){
        el.src = await it.testLoadImage();
      });
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  },
  testSaveImage: async function(blobURL){
    const it = ZTIMES.SECRETDB;
    await (()=>{
      return new Promise((resolve,reject)=>{
        const record20 = {recordKey:'hash20', content:blobURL};
        const params = {
          dbName:'/Ether0/Book0',
          version:2,
          tables:{
            '/Ether0/Book0/Sheet2':[record20],
          },
        };
        this.StoreDatabase(it,params).then(()=>{
          resolve();
        });
      });
    })();
  },
  testLoadImage: async function(){
    const it = ZTIMES.SECRETDB;
    const blobURL = await (()=>{
      return new Promise((resolve,reject)=>{
        const dbName = '/Ether0/Book0';
        const tableName = '/Ether0/Book0/Sheet2';
        const recordKey = 'hash20';
        this.GetRecord(dbName,tableName,recordKey).then((record)=>{
          const blobURL = record.content;
          resolve(blobURL);
        });
      });
    })();
    return blobURL;
  },
  loadSecret: function(it){
    return new Promise((resolve,reject)=>{
      const strSecret = localStorage.getItem('#Secret');
      if(strSecret === null){
        ZTIMES.CRYPTOGRAPH.GetSecret().then((secret)=>{
          it.secret = secret;
          ZTIMES.CRYPTOGRAPH.ToSecretHex(it.password,it.uid,secret).then((secretU32AC)=>{
            localStorage.setItem('#Secret',secretU32AC);
            resolve();
          });
        });
      }
      else{
        const secretU32AC = strSecret;
        ZTIMES.CRYPTOGRAPH.FromSecretHex(it.password,it.uid,secretU32AC).then((secret)=>{
          it.secret = secret;
          resolve();
        });
      }
    });
  },
  deleteDatabase: function(it){
    return new Promise((resolve,reject)=>{
      indexedDB.databases().then((dbList)=>{
        if(dbList.length === 0){
          resolve(0);
        }
        else{
          dbList.map((db)=>{
            const dbName = db['name'];
            const tableNameList = [];
            it.dbCaches[dbName] = {tableNameList:tableNameList};
            const requestDelete = indexedDB.deleteDatabase(dbName);
            requestDelete.onsuccess = function(event){
              console.log('delete : onsuccess');
              resolve();
            };
            requestDelete.onerror = function(event){
              console.log('delete : onerror' + event.target.error);
              resolve(0);
            };
          });
        }
      });
    });
  },
  loadDatabase: function(it){
    return new Promise((resolve,reject)=>{
      indexedDB.databases().then((dbList)=>{
        if(dbList.length === 0){
          resolve(0);
        }
        else{
          dbList.map((db)=>{
            const dbName = db['name'];
            const tableNameList = [];
            it.dbCaches[dbName] = {tableNameList:tableNameList};
            const requestOpen = indexedDB.open(dbName);
            requestOpen.onsuccess = function(event){
              console.log('open : onsuccess');
              const connection = event.target.result;
              const tableList = connection.objectStoreNames;
              Object.keys(tableList).forEach(function(index){
                const tableName = tableList[index];
                tableNameList.push(tableName);
              });
              connection.close();
              resolve(dbList.length);
            };
            requestOpen.onerror = function(event){
              console.log('open : onerror' + event.target.error);
              resolve(0);
            };
          });
        }
      });
    });
  },
  toParamsC: function(it,params,paramsC){
    const syncList = [];
    const syncDbName = it.toNameHashHex(it,params.dbName).then((dbNameHashHex)=>{
      paramsC.dbName = dbNameHashHex;
    });
    syncList.push(syncDbName);
    paramsC.version = params.version;
    paramsC.tables = {};
    Object.keys(params.tables).forEach((tableName)=>{
      const syncTable = new Promise((resolve,reject)=>{
        it.toNameHashHex(it,tableName).then((tableNameHashHex)=>{
          const syncListR = [];
          const recordListC = [];
          const recordList = params.tables[tableName];
          recordList.map(function(record){
            let recordC = {};
            const syncRecordKey = it.toNameHashHex(it,record.recordKey).then((recordKeyHashHex)=>{
              recordC.recordKey = recordKeyHashHex;
            });
            syncListR.push(syncRecordKey);
            const syncContent = ZTIMES.CRYPTOGRAPH.Encrypt(it.secret.keyEx,it.secret.iv,record.content).then((encryptedArray)=>{
              recordC.content = encryptedArray;
              recordListC.push(recordC);
            });
            syncListR.push(syncContent);
          });
          Promise.all(syncListR).then(()=>{
            paramsC.tables[tableNameHashHex] = recordListC;
            resolve();
          });
        });
      });
      syncList.push(syncTable);
    });
    return syncList;
  },
  StoreDatabase: function(it,params){
    return new Promise((resolve,reject)=>{
      let paramsC = {};
      const syncList = it.toParamsC(it,params,paramsC);
      Promise.all(syncList).then(()=>{
        const requestOpen = indexedDB.open(paramsC.dbName,paramsC.version);
        requestOpen.onupgradeneeded = function(event){
          console.log('open : onupgradeneeded');
          const connection = event.target.result;
          const tableNames = paramsC.tables;
          Object.keys(tableNames).forEach(function(tableName){
            connection.createObjectStore(tableName,{keyPath:'recordKey'});
          });
        };
        requestOpen.onsuccess = function(event){
          console.log('open : onsuccess');
          const connection = event.target.result;
          Object.keys(paramsC.tables).forEach((tableName)=>{
            const recordList = paramsC.tables[tableName];
            const transaction = connection.transaction(tableName,'readwrite');
            const table = transaction.objectStore(tableName);
            recordList.map(function(record){
              const requestPut = table.put(record);
              requestPut.onsuccess = function(){
                console.log('putRecord : onsuccess');
              },
              requestPut.onerror = function(event){
                console.log('putRecord : onerror' + event.target.error);
              };
            });
          });
          connection.close();
          resolve();
        };
        requestOpen.onerror = function(event){
          console.log('open : onerror' + event.target.error);
          resolve(null);
        };
      });
    });
  },
  PutRecord: function(dbName,tableName,record){
    const it = this;
    const tables = {};
    tables[tableName] = [record];
    const params = {dbName:dbName,tables:tables};
    const promise = this.StoreDatabase(it,params);
    return promise;
  },
  GetRecord: function(dbName,tableName,recordKey){
    const it = this;
    return new Promise((resolve,reject)=>{
      const tables = {};
      tables[tableName] = [];
      const params = {dbName:dbName,tables:tables};
      let paramsC = {};
      const syncList = it.toParamsC(it,params,paramsC);
      let recordKeyC = "";
      const syncRecordKey = it.toNameHashHex(it,recordKey).then((recordKeyHashHex)=>{
        recordKeyC = recordKeyHashHex;
      });
      syncList.push(syncRecordKey);
      Promise.all(syncList).then(()=>{
        const requestOpen = indexedDB.open(paramsC.dbName);
        requestOpen.onsuccess = function(event){
          console.log('open : onsuccess');
          const connection = event.target.result;
          const tableNames = paramsC.tables;
          const tableNameC = (Object.keys(tableNames))[0];
          const transaction = connection.transaction(tableNameC,'readonly');
          const table = transaction.objectStore(tableNameC);
          const requestGet = table.get(recordKeyC);
          requestGet.onsuccess = function(event){
            console.log('get : onsuccess');
            const record = event.target.result;
            ZTIMES.CRYPTOGRAPH.Decrypt(
              it.secret.keyEx,
              it.secret.iv,
              record.content
            ).then((text)=>{
              record.content = text;
              connection.close();
              resolve(record);
            });
          };
          requestGet.onerror = function(event){
            console.log('get : onerror' + event.target.error);
            reject(null);
          };
        };
        requestOpen.onerror = function(event){
          console.log('open : onerror' + event.target.error);
          resolve(null);
        };
      });
    });
  },
  toNameHashHex: function(it,name){
    return new Promise((resolve,reject)=>{
      const seed = name + it.password + it.uid;
      ZTIMES.CRYPTOGRAPH.GetHashHex(seed).then((nameHashHex)=>{
        resolve(nameHashHex);
      });
    });
  },
  GetRecordList: function(dbName,tableName){
    const it = this;
    return new Promise((resolve,reject)=>{
      const tables = {};
      tables[tableName] = [];
      const params = {dbName:dbName,tables:tables};
      let paramsC = {};
      const syncList = it.toParamsC(it,params,paramsC);
      Promise.all(syncList).then(()=>{
        const requestOpen = indexedDB.open(paramsC.dbName);
        requestOpen.onsuccess = function(event){
          console.log('open : onsuccess');
          const connection = event.target.result;
          const tableNames = paramsC.tables;
          const tableNameC = (Object.keys(tableNames))[0];
          const transaction = connection.transaction(tableNameC,'readonly');
          const table = transaction.objectStore(tableNameC);
          const requestGet = table.getAll();
          requestGet.onsuccess = function(event){
            console.log('getAll : onsuccess');
            const recordList = event.target.result;
            const recordList2 = [];
            const syncList = recordList.map((record)=>{
              return new Promise((resolve,reject)=>{
                ZTIMES.CRYPTOGRAPH.Decrypt(
                  it.secret.keyEx,
                  it.secret.iv,
                  record.content
                ).then((text)=>{
                  record.content = text;
                  recordList2.push(record);
                  resolve();
                });
              });
            });
            Promise.all(syncList).then(()=>{
              resolve(recordList2);
            });
            connection.close();
          };
          requestGet.onerror = function(event){
            console.log('getAll : onerror' + event.target.error);
            reject(null);
          };
        };
        requestOpen.onerror = function(event){
          console.log('open : onerror' + event.target.error);
          resolve(null);
        };
      });
    });
  },
}
