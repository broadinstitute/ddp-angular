import {PhiManifestComponent} from './phi-manifest.component';
import {DSMService} from '../services/dsm.service';

describe('Component: PhiManifestComponent', () => {
  let component: PhiManifestComponent;
  let mockDSMService: any;

  beforeAll(() => {
    global['DDP_ENV'] = { baseUrl: 'http://example.com', auth0ClientKey:'', auth0Domain:'' };
  });

  beforeEach(() => {

    // Mock the dependencies of DSMService
    const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']); // Add more methods as needed
    const mockSessionService = jasmine.createSpyObj('SessionService', ['method1', 'method2']);
    const mockRoleService = jasmine.createSpyObj('RoleService', ['method1', 'method2']);
    const mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    const mockLocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getItem', 'setItem']);
    const mockLoggingServiceSpy = jasmine.createSpyObj('LoggingService', ['logToCloud']);

    // Create a mock DSMService using the mock dependencies
    mockDSMService = new DSMService(
      mockHttpClient,
      mockSessionService,
      mockRoleService,
      mockRouter,
      mockLocalStorageService,
      mockLoggingServiceSpy
    );

    const auth = jasmine.createSpyObj('Auth', ['authenticated', 'sessionLogout']);
    const mockActivatedRoute = jasmine.createSpyObj('MockActivatedRoute', ['method1']);


    mockActivatedRoute.queryParams = jasmine.createSpyObj('Observable', ['subscribe']);
    // Create an instance of PhiManifestComponent
    component = new PhiManifestComponent(mockDSMService, auth, mockActivatedRoute);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
