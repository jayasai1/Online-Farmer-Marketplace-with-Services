import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('data');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JSONStore {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.data = this.load();
  }

  load() {
    if (fs.existsSync(this.filePath)) {
      try {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileContent);
      } catch (err) {
        console.error(`Error reading file ${this.filePath}:`, err);
        return [];
      }
    }
    return [];
  }

  save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error writing file ${this.filePath}:`, err);
    }
  }

  // Create documents instance with save() capability
  wrapDoc(doc) {
    if (!doc) return null;
    
    // Add instance method save()
    Object.defineProperty(doc, 'save', {
      value: async () => {
        const idx = this.data.findIndex(d => d._id === doc._id);
        if (idx !== -1) {
          const plainDoc = { ...doc };
          delete plainDoc.save;
          this.data[idx] = plainDoc;
          this.save();
        }
        return doc;
      },
      enumerable: false,
      configurable: true
    });
    
    return doc;
  }

  // Replicates Mongoose Query Builder synchronously with thenable interface
  find(query = {}) {
    const store = this;
    
    const queryObj = {
      _query: query,
      _populateFields: [],
      
      populate(fieldPath) {
        if (typeof fieldPath === 'string') {
          // Supports space separated fields: e.g. .populate('cropId buyerId')
          const fields = fieldPath.split(' ').filter(f => f.trim().length > 0);
          this._populateFields.push(...fields);
        }
        return this;
      },
      
      // Makes this object "thenable" so it can be directly awaited
      then(onFulfilled, onRejected) {
        try {
          let results = [...store.data];

          // Simple filter matching
          for (const [key, val] of Object.entries(this._query)) {
            if (val === undefined || val === null) continue;
            
            if (typeof val === 'object' && val.$regex) {
              const regex = new RegExp(val.$regex, val.$options || '');
              results = results.filter(d => regex.test(d[key]));
            } else if (typeof val === 'object' && val.$in) {
              // Array inclusion: e.g., cropId: { $in: [...] }
              const strIn = val.$in.map(v => String(v));
              results = results.filter(d => strIn.includes(String(d[key])));
            } else if (typeof val === 'object' && (val.$lt !== undefined || val.$gte !== undefined)) {
              if (val.$lt !== undefined) results = results.filter(d => d[key] < val.$lt);
              if (val.$gte !== undefined) results = results.filter(d => d[key] >= val.$gte);
            } else {
              // Direct matching
              results = results.filter(d => String(d[key]) === String(val));
            }
          }

          // Wrap results
          const wrapped = results.map(d => store.wrapDoc({ ...d }));

          // Perform populated lookups if requested
          for (const fieldPath of this._populateFields) {
            for (const doc of wrapped) {
              const idVal = doc[fieldPath];
              if (idVal) {
                let targetCollection = fieldPath.replace('Id', '').toLowerCase() + 's';
                if (fieldPath === 'ownerId' || fieldPath === 'sellerId' || fieldPath === 'buyerId') {
                  targetCollection = 'users';
                } else if (fieldPath === 'serviceId') {
                  // Dynamic polymorphic ref
                  const modelVal = doc.serviceModel;
                  if (modelVal === 'Tractor') targetCollection = 'tractors';
                  else if (modelVal === 'Labor') targetCollection = 'labors';
                  else if (modelVal === 'AgroService') targetCollection = 'agroservices';
                }
                
                const refStore = new JSONStore(targetCollection);
                const populated = refStore.data.find(t => String(t._id) === String(idVal));
                doc[fieldPath] = populated ? { ...populated } : null;
              }
            }
          }

          return Promise.resolve(wrapped).then(onFulfilled, onRejected);
        } catch (err) {
          if (onRejected) {
            return Promise.reject(err).catch(onRejected);
          }
          throw err;
        }
      }
    };
    
    return queryObj;
  }

  findOne(query = {}) {
    const store = this;
    const queryObj = {
      _query: query,
      _populateFields: [],
      
      populate(fieldPath) {
        if (typeof fieldPath === 'string') {
          const fields = fieldPath.split(' ').filter(f => f.trim().length > 0);
          this._populateFields.push(...fields);
        }
        return this;
      },
      
      then(onFulfilled, onRejected) {
        // Query single document
        const findObj = store.find(this._query);
        findObj._populateFields = this._populateFields;
        
        return findObj.then(results => {
          const doc = results.length > 0 ? results[0] : null;
          return onFulfilled(doc);
        }, onRejected);
      }
    };
    
    return queryObj;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(docData) {
    const newDoc = {
      _id: 'mock_' + Math.random().toString(36).substr(2, 9),
      ...docData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.push(newDoc);
    this.save();
    return this.wrapDoc(newDoc);
  }

  async findOneAndDelete(query = {}) {
    const doc = await this.findOne(query);
    if (doc) {
      this.data = this.data.filter(d => d._id !== doc._id);
      this.save();
      return doc;
    }
    return null;
  }

  async countDocuments() {
    return this.data.length;
  }

  async insertMany(arr) {
    const created = arr.map(d => ({
      _id: 'mock_' + Math.random().toString(36).substr(2, 9),
      ...d,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    this.data.push(...created);
    this.save();
    return created.map(d => this.wrapDoc(d));
  }
}

export default JSONStore;
