var sqlite = require('sqlite3').verbose();

module.exports = class Accounts {

	constructor()
	{
		this.db = new sqlite.Database('accounts.db', sqlite.OPEN_READWRITE);
		this.currentIndex = 0
		this.current = {}
	}

	fetchAll()
	{
		return new Promise((resolve,reject) => {
			this.db.all('SELECT * FROM accounts', (err, rows) => {
				if(err) reject(err)
				resolve(rows)
			})
		})
	}

	count()
	{
		return this.list.length;
	}

	showList()
	{
		debug.log(this.list);
	}
	
	select(index)
	{
		return new Promise((resolve,reject) => {
			if(this.count() == 0) reject(new Error('Zero accounts in database'))
			if(this.count()-1 < index) reject(new Error('Account index out of range'))

			this.currentIndex = index;
			this.current = this.list[index];
			resolve()
		})
	}

	selectFirst()
	{
		return this.select(0);
	}

	next()
	{
		return this.select(this.currentIndex+1);
	}

	nextExists()
	{
		return this.count()-1 >= this.currentIndex+1;
	}

	update(index)
	{
		return new Promise((resolve,reject) => {
			this.db.run("UPDATE accounts SET uploaded_videos = ? , total_uploaded_videos = ? , last_uploaded = ? WHERE id = ?",
				this.list[index].uploaded_videos, 
				this.list[index].total_uploaded_videos,
				this.list[index].last_uploaded,
				this.list[index].id,
				(err) => {
					if(err) reject(err)
					resolve()
				}
			);
		})
	}

	updateCurrent(index)
	{
		this.update(this.currentIndex);
	}

	insertNew(account)
	{
		this.db.run("INSERT INTO accounts (id,access_token,refresh_token) VALUES(null,?,?)", account.access_token, account.refresh_token, (err) => {
			if(err) throw new Error(err)
			return true;
 		});
	}
}