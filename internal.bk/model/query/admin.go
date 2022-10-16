package query

import (
	"database/sql"

	"inquiry-chat/internal/core/db"
	"inquiry-chat/internal/model/entity"
)


type AdminQuery interface {
	IsAdmin(userId int) bool
	SelectAdmins() ([]entity.User, error)
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


func (que *adminQuery) SelectAdmins() ([]entity.User, error) {
	var ret []entity.User

	rows, err := que.db.Query(
		`SELECT 
			u.user_id, 
			u.user_name,
			u.nickname
		 FROM users u, admin a 
		 WHERE u.user_id = a.user_id`, 
	)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		u := entity.User{}

		err = rows.Scan(
			&u.UserId,
			&u.UserName,
			&u.Nickname,
		)
		if err != nil {
			break
		}
		ret = append(ret, u)
	}

	return ret, err
}