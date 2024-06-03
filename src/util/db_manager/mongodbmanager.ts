import { Collection, ObjectId } from "mongodb";

export class CollectionManager {
    private collection: Collection<any>; // Use any type for flexibility with JSON objects

    constructor(collection: Collection<any>) {
        this.collection = collection;
    }

    async addItem(item: any , options? :any): Promise<boolean> {

        if(options){
            
         
            const filter = {'id' : options.id  };
            const path = options['path']; // Assuming 'path' is the dynamic key
            console.log("path " , path);
            const update = { $push: { [path]: item } };
                
            const result = await this.collection.updateOne(filter , update as unknown as Document[]);
            return result.modifiedCount === 1;
            }
        else{
            const result = await this.collection.insertOne(item);
        
            if (result.insertedId) {
                return true;
            } else {
                return false;
            }
        }
        
    }

    async deleteItemById(id: string , options? :any): Promise<boolean> {

        const update = {
            $pull: {}
          };
    
        if(options){
            var filter = { id: id   };
            const [arraypath , indexid] = Object.entries(options)[0];
            filter[arraypath] ={$elemMatch: {id:indexid}};
            update.$pull[arraypath] = {id: indexid};
        
            const result = await this.collection.updateOne(filter ,update);
            console.log(result.modifiedCount === 1);
            return result.modifiedCount === 1;
            }
        else{const filter = { id: id  };
       const result = await this.collection.deleteOne(filter);
        console.log(result.deletedCount === 1);
        return result.deletedCount === 1;
        }
       
    

        

    }

    async getItemById(id: string ,  options? :any): Promise<any | null> {
        if(options){
          return await this.collection.find({ id: id }).project({[options] : 1 ,_id :0}).toArray();}
        else {
        return await this.collection.findOne({ id: id });}
    }

    async getItemByName(name: string): Promise<any | null> {
        return this.collection.findOne({ username: name });
    }

    async modifyItemById(id: string, updateFields: any, options?: any): Promise<boolean> {
        const update = {
          $set: {}
        };
        let filter = { id: id }; // Define filter outside the conditional scope to ensure it's always available
      
        if (options) {
          const [arraypath, indexid] = Object.entries(options)[0];
          filter = { id: id }; // Ensure the filter includes the original id filter
          filter[arraypath] = { $elemMatch: { id: indexid } };
      
          for (const [key, value] of Object.entries(updateFields)) {
            update.$set[arraypath+'.$.'+key] = value;
          }
        } else {
          for (const [key, value] of Object.entries(updateFields)) {
            update.$set[key] = value;
          }
        }
      
        console.log('Filter:', filter);
        console.log('Update:', update);
      
        try {
          const result = await this.collection.updateOne(filter, update);
          console.log(result.modifiedCount === 1);
          return result.modifiedCount === 1;
        } catch (error) {
          console.error('Error updating document:', error);
          return false;
        }
      }

    async validateDataById(id: string, features: string[]): Promise<boolean> {
        const item = await this.collection.findOne({ id: id });
        if (!item) return false;

        for (const feature of features) {
            if (!(feature in item)) {
                return false;
            }
        }
        return true;
    }
}
