// Importaciones necesarias para realizar pruebas unitarias en Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importación del componente a probar
import { ModalCreateProjectComponent } from './modal-create-project.component';

// Definición del grupo de pruebas para el componente
describe('ModalCreateProjectComponent', () => {

  // Variables que se usarán en las pruebas
  let component: ModalCreateProjectComponent;
  let fixture: ComponentFixture<ModalCreateProjectComponent>;

  // Configuración que se ejecuta antes de cada prueba
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Se importa el propio componente como módulo (Angular 14+ permite esto con standalone components)
      imports: [ModalCreateProjectComponent]
    })
    .compileComponents(); // Compila los componentes declarados

    // Se crea una instancia del componente y se asigna al fixture
    fixture = TestBed.createComponent(ModalCreateProjectComponent);
    component = fixture.componentInstance; // Se obtiene la instancia del componente
    fixture.detectChanges(); // Dispara la detección de cambios para inicializar el componente
  });

  // Caso de prueba: verifica que el componente se haya creado correctamente
  it('should create', () => {
    expect(component).toBeTruthy(); // Se espera que la instancia del componente exista
  });
});
