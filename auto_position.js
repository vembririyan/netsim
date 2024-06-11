let naming = []
    naming["TERA"] = new RegExp(/^(T-|P-)|P[0-9]-/);
    naming["ME9"] = new RegExp(/^ME9-/);
    naming["ME"] = new RegExp(/^(ME|SME)(?!ME9)/);
    naming["GPON"] = new RegExp(/^GPON/);
    naming["BRAS"] = new RegExp(/^BRAS/);
    naming["PE"] = new RegExp(/^PE/);
    naming["CDN"] = new RegExp(/^CDN/);
    naming["CGW"] = new RegExp(/^CGW/);
    naming["HRB"] = new RegExp(/^HRB/);
const vcenterX = 0
const vcenterY = 0
const spaceMin = 500
const spacePlus = 500
const spaceMinTera = 500
const spacePlusTera = 500
const CordinateBase = [
    {x:0,y:0},
    {x:vcenterX+spacePlus+1500,y:vcenterY+spacePlus+5500}, //2
    {x:vcenterX+spacePlus+6500,y:vcenterY+spacePlus+700}, //1
    
    {x:vcenterX+spaceMin-3000,y:vcenterY+spacePlus+5500}, //3
    {x:vcenterX+spaceMin-6500,y:vcenterY+spacePlus+1500}, //4
    {x:vcenterX+spaceMin-6500,y:vcenterY+spaceMin-3500}, //5
    {x:vcenterX+spaceMin-0,y:vcenterY+spaceMin-7200}, //6
    {x:vcenterX+spacePlus+5500,y:vcenterY+spaceMin-5000}, //7
    
    ];
const CordinateBaseTera = [
    {x:0,y:0},
    {x:vcenterX+1300,y:vcenterY+200}, //1
    {x:vcenterX+800,y:vcenterY+1200}, //2
    {x:vcenterX-500,y:vcenterY+1200}, //3
    {x:vcenterX-800,y:vcenterY+200}, //4
    {x:vcenterX-800,y:vcenterY-800}, //5
    {x:vcenterX-0,y:vcenterY-1500}, //6
    {x:vcenterX+1300,y:vcenterY-800}, //7
    ];
let me9_co = {
    'ME9-D2-CKA':{x: 500, y: 200},
    'ME9-D2-SLP':{x: -500, y: 200},
    'ME9-D2-JT':{x: 1000, y: 200},
    'ME9-D2-BKS':{x: 2000, y: 200},
    'ME9-D2-KB':{x: -2500, y: 200},
    'ME9-D2-BOO':{x: -1000, y: 200},

    'ME9-D3-CCD':{x: 1500, y: 200},
    'ME9-D3-LBG':{x: 300, y: 200},

    'ME9-D3-CBN':{x: -1000, y: 300},
    'ME9-D3-TSM':{x: -500, y: 200},

    'ME9-D4-BTG':{x: -1000, y: 400},
    'ME9-D4-GLK':{x: -500, y: 2500},

    'ME9-D4-KBU':{x: -1300, y: 1500},
    'ME9-D4-GBL':{x: -500, y: 800},

    'ME9-D4-KDS':{x: -1000, y: -300},
    'ME9-D4-PKL':{x: -1500, y: 700},

    'ME9-D4-PWT':{x: -200, y: 1700},
    
}
function auto_position (nodes, edges){
    let levels = []

    let cdn_cgw = nodes.filter(a=>naming.CDN.test(a.node) || naming.CGW.test(a.node))
    let tera= nodes.filter(a=>naming.TERA.test(a.node)).sort(compare)
    let pe = nodes.filter(a=>naming.PE.test(a.node)).sort(compare)
    let bras = nodes.filter(a=>naming.BRAS.test(a.node)).sort(compare)
    let me9 = nodes.filter(a=>naming.ME9.test(a.node)).sort(compare)
    let me = nodes.filter(a=>naming.ME.test(a.node) && !naming.ME9.test(a.node)).sort(compare)
    let gpon = nodes.filter(a=>naming.GPON.test(a.node)).sort(compare)
    const nodes_c = {}
    const levels_me9 = {treg1:[],treg2:[],treg3:[],treg4:[],treg5:[],treg6:[],treg7:[]};
    
    nodes_new = [...nodesRound(cdn_cgw, nodes_c), ...nodesRound(tera, nodes_c), ...nodesRound(pe, nodes_c), ...nodesRound(bras, nodes_c), ...nodesRound(me9, nodes_c)]
    nodes_new = [...nodes_new, ...nodesFlower(me, edges, nodes_c), ...nodesFlower(gpon, edges, nodes_c)]
    return nodes_new
}

function nodesDefining(nodes){
    let level = 999;
    let NE = nodes.forEach((node, x)=>{      
            if(naming.CDN.test(node.node) || naming.CGW.test(node.node) ) {
                node.level = 1
            }else if(naming.TERA.test(node.node)){
                node.level = 2
            }else if(naming.PE.test(node.node)){
                node.level = 3
            }else if(naming.BRAS.test(node.node)){
                node.level = 4
            }else if(naming.ME9.test(node.node)) {
                console.log(node.node)
                node.level = 5
            }else if(naming.ME.test(node.node)){
                node.level = 6
            }else if(naming.GPON.test(node.node)){
                node.level = 7
            }
    })   

    return level
}

function nodesRound(nodes, nodes_c){
    let levels = []
    const nodes_new = []
    const levels_me9 = {treg1:[],treg2:[],treg3:[],treg4:[],treg5:[],treg6:[],treg7:[]};

    nodes.forEach((node,x) => {
        try {
            if(node.level <= 3){
                let radius = 200
                if(node.level==2 && naming.TERA.test(node.node)){
                    radius=1000
                }else if(node.level==2 && naming.PE.test(node.node)){
                    radius=1500
                }else if(node.level==3 && naming.BRAS.test(node.node)){
                    radius=1500
                }
                
                if (!levels[node.level]) levels[node.level] = [];
                let angle = (2 * Math.PI * levels[node.level].length) / (nodes.filter(d => d.level === node.level).length);
                
                node.x = Math.round(vcenterX + (node.level * radius) * Math.cos(angle));
                node.y = Math.round(vcenterY + (node.level * radius) * Math.sin(angle));

                if(node.level==4){
                    angle = (2 * Math.PI * levels[node.level].length) / nodes.filter(d => getTreg(d.node)==getTreg(node.node)).length
                    xPlus = CordinateBaseTera[getTreg(node.node)?getTreg(node.node):2].x
                    yPlus = CordinateBaseTera[getTreg(node.node)?getTreg(node.node):2].y
                    node.x = Math.round(xPlus + (200 *node.level) * Math.cos(angle));
                    node.y = Math.round(yPlus + (200 *node.level) * Math.sin(angle));
                }
                
                nodes_c[node.node] = {x:node.x, y: node.y}
                levels[node.level].push(node);
                nodes_new.push(node)

            }else if(node.level <= 4) {
                let radius = 200
               
        
                if (!levels[node.level]) levels[node.level] = [];
                xPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].x
                yPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].y
            
                const angle = (6 * Math.PI * levels[node.level].length) / (nodes.filter(d => getTreg(d.node)==getTreg(node.node)).length);
                
                node.x = Math.round(xPlus + ((8 - node.level) * radius) * Math.cos(angle));
                node.y = Math.round(yPlus + ((8 - node.level) * radius) * Math.sin(angle));


                if(Object.keys(me9_co).some(a=> a==node.node)){
                    node.x = Math.round(xPlus + me9_co[node.node].x);
                    node.y = Math.round(yPlus + me9_co[node.node].y);
                }

                nodes_c[node.node] = {node:node.node, x: node.x, y: node.y}
                nodes_new.push(node)
                levels[node.level].push(node);
            }else if(node.level <= 6) {
                let radius = 200
               
        
                if (!levels[node.level]) levels[node.level] = [];
                xPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].x
                yPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].y
            
                const angle = (6 * Math.PI * levels[node.level].length) / (nodes.filter(d => getTreg(d.node)==getTreg(node.node)).length);
                
                node.x = Math.round(xPlus + ((8 - node.level) * radius) * Math.cos(angle));
                node.y = Math.round(yPlus + ((8 - node.level) * radius) * Math.sin(angle));


                if(Object.keys(me9_co).some(a=> a==node.node)){
                    node.x = Math.round(xPlus + me9_co[node.node].x);
                    node.y = Math.round(yPlus + me9_co[node.node].y);
                }

                nodes_c[node.node] = {node:node.node, x: node.x, y: node.y}
                nodes_new.push(node)
                levels[node.level].push(node);
            }


            } catch (error) {
                console.log(error)
            }
    })

    
    return nodes_new    
}

function nodesFlower(nodes, edges , nodes_c){
    let levels = []
    const nodes_new = []
    let nodes_point = {}

    nodes.forEach((node,x)=>{
        if(node.tier==1){
            return
        }else{
            radius = 10

            if (!levels[node.level]) levels[node.level] = [];
            
            try {
                let node_center = edges.find(a=>a.from == node.node)
                let length_center = edges.filter(a=>a.to == node_center.to).length

                edges.find(a=>a.from == node.node) ? nodes_c[edges.find(a=>a.from == node.node).to] : 0 ;
                
                let node_refer = edges.find(a=>a.from == node.node) ? nodes_c[edges.find(a=>a.from == node.node).to] : 0 ;
                let angle = (2 * Math.PI * (levels[node.level].length)) / (length_center);

                if(node_refer ){
                    Cx = node_refer.x + (node.level * radius) * Math.cos(angle);
                    Cy = node_refer.y + (node.level * radius) * Math.sin(angle);

                    node.x = Cx
                    node.y = Cy

                    xPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].x
                    yPlus = CordinateBase[getTreg(node.node)?getTreg(node.node): 2].y 

                    if(Object.keys(me9_co).some(a=>a==node_center.to) && (getTreg(node_center.to)==3 || getTreg(node_center.to)==4)){
                        if (!nodes_point[node_center.to]) nodes_point[node_center.to] = [];
                        nodes_point[node_center.to].push(node.node)
                        console.log(nodes_point[node_center.to].length)
                        node.x = xPlus + me9_co[node_center.to].x + 200 + (nodes_point[node_center.to].length*20)
                        node.y = yPlus + me9_co[node_center.to].y - 400 + (nodes_point[node_center.to].length*150)
                    }

                    nodes_c[node.node] = {x:node.x, y: node.y}
                    nodes_new.push(node)
                    levels[node.level].push(node);
                }else{
                    // Cx = CordinateBase[getTreg(node.node)?getTreg(node.node):1].x
                    // Cy = CordinateBase[getTreg(node.node)?getTreg(node.node):1].y
                }
            } catch (error) {
                console.log(error)
            }

           
        
        }
    })

    return nodes_new
}

function compare( a, b ) {
  if ( getTreg(a.node) < getTreg(b.node) ){
    return -1;
  }
  if ( getTreg(a.node) > getTreg(b.node) ){
    return 1;
  }
  return 0;
}

function getTreg(str) {
    // Regular expression to find the value after '-D'
    const regex = /-D(\d+)-/;
    // Execute the regex on the input string
    const match = str.match(regex);
    // If a match is found, return the captured group, otherwise return null
    return match ? match[1] : null;
}