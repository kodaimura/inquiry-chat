package query

import (
	"database/sql"

	"inquiry-chat/internal/core/db"
	"inquiry-chat/internal/model/entity"
)


type AdminQuery interface {
	IsAdmin(userId int) bool
	Select() (entity.User, error)
}


type adminQuery struct {
	db *sql.DB
}


func NewAdminQuery() AdminQuery {
	db := db.GetDB()
	return &adminQuery{db}
}


func (que *adminQuery) IsAdmin(userId int) bool {
	var count int

	 que.db.QueryRow(
		`SELECT 
			count(1)
		 FROM admin
		 WHERE user_id = ?`, 
		 userId,
	).Scan(
		&count,
	)

	return count != 0
}


func (que *adminQuery) Select() (entity.User, error) {
	var ret entity.User

	err := que.db.QueryRow(
		`SELECT 
			u.user_id, 
			u.user_name,
		 FROM users u, admin a 
		 WHERE u.user_id = a.user_id`, 
	).Scan(
		&ret.UserId, 
		&ret.UserName,
	)

	return ret, err
}