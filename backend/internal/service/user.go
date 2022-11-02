package service

import (
	"golang.org/x/crypto/bcrypt"

	"backend/internal/core/jwt"
	
	"backend/internal/core/logger"
	"backend/internal/model/entity"
	"backend/internal/model/repository"
	"backend/internal/model/query"
)


type UserService interface {
	Signup(username, password string) int
	Login(username, password string) int
	GenerateJWT(userId int) string
	GetProfile(userId int) (entity.User, error)
	ChangeUsername(userId int, username string) int
	ChangeNickname(userId int, nickname string) int
	ChangePassword(userId int, password string) int
	DeleteUser(userId int) int
	GetUsers() ([]entity.User, error)
	GetAdmins() ([]entity.User, error)
}


type userService struct {
	uRep repository.UserRepository
	aQue query.AdminQuery
}


func NewUserService() UserService {
	uRep := repository.NewUserRepository()
	aQue := query.NewAdminQuery()
	return &userService{uRep, aQue}
}


// Signup() Return value
/*----------------------------------------*/
const SIGNUP_SUCCESS_INT = 0
const SIGNUP_CONFLICT_INT = 1
const SIGNUP_ERROR_INT = 2
/*----------------------------------------*/

func (serv *userService) Signup(username, password string) int {
	_, err := serv.uRep.SelectByName(username)

	if err == nil {
		return SIGNUP_CONFLICT_INT
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		logger.LogError(err.Error())
		return SIGNUP_ERROR_INT
	}

	var user entity.User
	user.UserName = username
	user.Nickname = username
	user.Password = string(hashed)

	err = serv.uRep.Insert(&user)

	if err != nil {
		logger.LogError(err.Error())
		return SIGNUP_ERROR_INT
	}

	return SIGNUP_SUCCESS_INT
}


// Login() Return value
/*----------------------------------------*/
const LOGIN_FAILURE_INT = -1
// 正常時: ユーザ識別ID
/*----------------------------------------*/

func (serv *userService) Login(username, password string) int {
	user, err := serv.uRep.SelectByName(username)

	if err != nil || bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) != nil {
		return LOGIN_FAILURE_INT
	}

	return user.UserId
}


// GenerateJWT() Return value
/*----------------------------------------*/
const GENERATE_JWT_FAILURE_STR = ""
// 正常時: jwt文字列
/*----------------------------------------*/

func (serv *userService) GenerateJWT(userId int) string {
	user, err := serv.uRep.Select(userId)
	
	if err != nil {
		logger.LogError(err.Error())
		return GENERATE_JWT_FAILURE_STR
	}

	var cc jwt.CustomClaims
	cc.UserId = user.UserId
	cc.UserName = user.UserName
	cc.Nickname = user.Nickname
	cc.IsAdmin = serv.aQue.IsAdmin(userId)
	jwtStr, err := jwt.GenerateJWT(cc)

	if err != nil {
		logger.LogError(err.Error())
		return GENERATE_JWT_FAILURE_STR
	}

	return jwtStr
}


func (serv *userService) GetProfile(userId int) (entity.User, error) {
	user, err := serv.uRep.Select(userId)

	if err != nil {
		logger.LogError(err.Error())
	}

	return user, err
}


// ChangeUsername() Return value
/*----------------------------------------*/
const CHANGE_USERNAME_SUCCESS_INT = 0
const CHANGE_USERNAME_FAILURE_INT = 1
/*----------------------------------------*/
func (serv *userService) ChangeUsername(userId int, username string) int {
	err := serv.uRep.UpdateName(userId, username)

	if err != nil {
		logger.LogError(err.Error())
		return CHANGE_USERNAME_FAILURE_INT
	}

	return CHANGE_USERNAME_SUCCESS_INT
}


// ChangeNickname() Return value
/*----------------------------------------*/
const CHANGE_NICKNAME_SUCCESS_INT = 0
const CHANGE_NICKNAME_FAILURE_INT = 1
/*----------------------------------------*/
func (serv *userService) ChangeNickname(userId int, nickname string) int {
	err := serv.uRep.UpdateNickname(userId, nickname)

	if err != nil {
		logger.LogError(err.Error())
		return CHANGE_NICKNAME_FAILURE_INT
	}

	return CHANGE_NICKNAME_SUCCESS_INT
}


// ChangePassword() Return value
/*----------------------------------------*/
const CHANGE_PASSWORD_SUCCESS_INT = 0
const CHANGE_PASSWORD_FAILURE_INT = 1
/*----------------------------------------*/
func (serv *userService) ChangePassword(userId int, password string) int {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		logger.LogError(err.Error())
		return CHANGE_PASSWORD_FAILURE_INT
	}

	err = serv.uRep.UpdatePassword(userId, string(hashed))
	
	if err != nil {
		logger.LogError(err.Error())
		return CHANGE_PASSWORD_FAILURE_INT
	}

	return CHANGE_PASSWORD_SUCCESS_INT
}


// DeleteUser() Return value
/*----------------------------------------*/
const DELETE_USER_SUCCESS_INT = 0
const DELETE_USER_FAILURE_INT = 1
/*----------------------------------------*/
func (serv *userService) DeleteUser(userId int) int {
	err := serv.uRep.Delete(userId)

	if err != nil {
		logger.LogError(err.Error())
		return DELETE_USER_FAILURE_INT
	}

	return DELETE_USER_SUCCESS_INT
}


func (serv *userService) GetUsers() ([]entity.User, error) {
	users, err := serv.uRep.SelectAll()

	if err != nil {
		logger.LogError(err.Error())
	}

	return users, err
}


func (serv *userService) GetAdmins() ([]entity.User, error) {
	users, err := serv.aQue.SelectAdmins()

	if err != nil {
		logger.LogError(err.Error())
	}

	return users, err
}
