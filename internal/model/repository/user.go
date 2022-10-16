package repository

import (
	"database/sql"

	"inquiry-chat/internal/core/db"
	"inquiry-chat/internal/model/entity"
)


type UserRepository interface {
	SelectAll() ([]entity.User, error)
	Select(id int) (entity.User, error)
	Insert(u *entity.User) error
	Update(id int, u *entity.User) error
	Delete(id int) error
	
	/* 以降に追加 */
	SelectByName(name string) (entity.User, error)
	UpdatePassword(id int, password string) error
	UpdateName(id int, name string) error
	UpdateNickname(id int, name string) error
}


type userRepository struct {
	db *sql.DB
}


func NewUserRepository() UserRepository {
	db := db.GetDB()
	return &userRepository{db}
}


func (rep *userRepository) SelectAll() ([]entity.User, error) {
	var ret []entity.User

	rows, err := rep.db.Query(
		`SELECT 
			user_id, 
			user_name, 
			nickname,
			create_at, 
			update_at 
		 FROM users`,
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
			&u.CreateAt, 
			&u.UpdateAt,
		)
		if err != nil {
			break
		}
		ret = append(ret, u)
	}

	return ret, err
}


func (rep *userRepository) Select(id int) (entity.User, error){
	var ret entity.User

	err := rep.db.QueryRow(
		`SELECT 
			user_id, 
			user_name, 
			nickname,
			create_at, 
			update_at 
		 FROM users 
		 WHERE user_id = ?`, 
		 id,
	).Scan(
		&ret.UserId, 
		&ret.UserName, 
		&ret.Nickname,
		&ret.CreateAt, 
		&ret.UpdateAt,
	)

	return ret, err
}


func (rep *userRepository) Insert(u *entity.User) error {
	_, err := rep.db.Exec(
		`INSERT INTO users (
			user_name, 
			nickname,
			password
		 ) VALUES(?,?,?)`,
		u.UserName, 
		u.Nickname,
		u.Password,
	)
	return err
}


func (rep *userRepository) Update(id int, u *entity.User) error {
	_, err := rep.db.Exec(
		`UPDATE users 
		 SET user_name = ? 
			  nickname = ?
			 password = ?
		 WHERE user_id = ?`,
		u.UserName,
		u.Nickname,
		u.Password, 
		id,
	)
	return err
}


func (rep *userRepository) Delete(id int) error {
	_, err := rep.db.Exec(
		`DELETE FROM users WHERE user_id = ?`, 
		id,
	)

	return err
}


func (rep *userRepository) UpdatePassword(id int, password string) error {
	_, err := rep.db.Exec(
		`UPDATE users 
		 SET password = ? 
		 WHERE user_id = ?`, 
		 password, 
		 id,
	)
	return err
}


func (rep *userRepository) UpdateName(id int, name string) error {
	_, err := rep.db.Exec(
		`UPDATE users
		 SET user_name = ? 
		 WHERE user_id = ?`, 
		name, 
		id,
	)
	return err
}


func (rep *userRepository) UpdateNickname(id int, name string) error {
	_, err := rep.db.Exec(
		`UPDATE users
		 SET nickname = ? 
		 WHERE user_id = ?`, 
		name, 
		id,
	)
	return err
}


func (rep *userRepository) SelectByName(name string) (entity.User, error) {
	var ret entity.User

	err := rep.db.QueryRow(
		`SELECT 
			user_id, 
			user_name, 
			nickname, 
			password, 
			create_at, 
			update_at 
		 FROM users 
		 WHERE user_name = ?`, 
		 name,
	).Scan(
		&ret.UserId, 
		&ret.UserName, 
		&ret.Nickname,
		&ret.Password, 
		&ret.CreateAt, 
		&ret.UpdateAt,
	)

	return ret, err
}
