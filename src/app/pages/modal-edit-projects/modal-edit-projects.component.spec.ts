// Importaciones necesarias para configurar y ejecutar pruebas unitarias con Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente que se va a probar
import { ModalEditProjectsComponent } from './modal-edit-projects.component';

// Bloque principal de pruebas para el componente ModalEditProjectsComponent.
// 'describe' permite agrupar un conjunto de pruebas relacionadas con este componente.
describe('ModalEditProjectsComponent', () => {
  // Declaración de las variables necesarias para acceder al componente y al fixture (el entorno de prueba del componente).
  let component: ModalEditProjectsComponent;
  let fixture: ComponentFixture<ModalEditProjectsComponent>;

  // Este bloque se ejecuta antes de cada prueba.
  // Utiliza 'async' porque la configuración del entorno de pruebas puede incluir tareas asincrónicas.
  beforeEach(async () => {
    // Configura el entorno de pruebas del componente usando TestBed
    await TestBed.configureTestingModule({
      // Registra el componente como parte de los imports (cuando se usa como componente standalone)
      imports: [ModalEditProjectsComponent]
    })
    .compileComponents(); // Compila los componentes declarados en la configuración

    // Crea una instancia del componente y su fixture de pruebas
    fixture = TestBed.createComponent(ModalEditProjectsComponent);
    component = fixture.componentInstance;

    // Detecta los cambios en la vista, necesario para inicializar el DOM del componente
    fixture.detectChanges();
  });

  // Prueba unitaria: verifica que el componente se cree correctamente
  it('should create', () => {
    // Espera que la instancia del componente sea verdadera (es decir, que se haya creado exitosamente)
    expect(component).toBeTruthy();
  });
});
