import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, of } from 'rxjs';
import { DataService } from '../services/data.service';

// Mock SQLite que simula la base de datos y el login
class SQLiteMock {
  create() {
    return Promise.resolve({
      executeSql: (query: string, params: any[]) => {
        if (query.includes('SELECT * FROM usuarios WHERE correo = ? AND password = ?')) {
          if (params[0] === 'test@ejemplo.com' && params[1] === '1234') {
            return Promise.resolve({
              rows: {
                length: 1,
                item: (i: number) => ({ correo: 'test@ejemplo.com', password: '1234' }),
              }
            });
          }
          return Promise.resolve({
            rows: {
              length: 0,
              item: (i: number) => null,
            }
          });
        }
        return Promise.resolve({
          rows: {
            length: 0,
            item: (i: number) => null,
          }
        });
      }
    });
  }
}

class AuthServiceMock {
  loginWithRedirect = jasmine.createSpy('loginWithRedirect');
  logout = jasmine.createSpy('logout');
  isAuthenticated$ = of(true);
  user$ = of({ email: 'test@ejemplo.com' });
}

class DataServiceMock {
  loginUser = jasmine.createSpy('loginUser').and.callFake((correo: string, pass: string) => {
    return Promise.resolve(correo === 'test@ejemplo.com' && pass === '1234');
  });
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    navCtrlSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
    alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);

    alertControllerSpy.create.and.callFake((opts) => {
      return Promise.resolve({
        present: jasmine.createSpy('present')
      } as any);
    });

    await TestBed.configureTestingModule({
      declarations: [LoginPage],
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        { provide: NavController, useValue: navCtrlSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: AuthService, useClass: AuthServiceMock },
        { provide: DataService, useClass: DataServiceMock }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar alerta si el correo se encuentra vacío', async () => {
    component.correo = '';
    component.password = '1234';

    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'El campo de correo no puede estar vacío',
      buttons: ['OK'],
    });
  });

  it('debería mostrar una alerta si el email tiene formato inválido', async () => {
    component.correo = 'email_invalido';
    component.password = '1234';

    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'El formato del correo es inválido',
      buttons: ['OK'],
    });
  });

  it('debería mostrar una alerta si el campo de contraseña está vacío', async () => {
    component.correo = 'test@ejemplo.com';
    component.password = '';

    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'El campo contraseña no puede estar vacío',
      buttons: ['OK'],
    });
  });

  it('debería mostrar una alerta si la contraseña tiene más de 8 caracteres', async () => {
    component.correo = 'test@ejemplo.com';
    component.password = '123456789';

    await component.login();

    expect(alertControllerSpy.create).toHaveBeenCalledWith({
      header: 'Error',
      message: 'La contraseña debe tener entre 3 y 8 caracteres',
      buttons: ['OK'],
    });
  });

  it('debería navegar al homepage si las validaciones son correctas', async () => {
    component.correo = 'test@ejemplo.com';
    component.password = '1234';

    await component.login();

    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith(['/home'], {
      queryParams: {
        email: 'test@ejemplo.com'
      }
    });
  });
});

